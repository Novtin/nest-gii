import * as fs from 'node:fs';
import * as path from 'path';
import {escapeRegExp, snakeCase, uniq, isBoolean} from 'lodash';
import {CreateEntityDto} from '../../domain/dtos/CreateEntityDto';
import {CreateEntityFieldDto} from '../../domain/dtos/CreateEntityFieldDto';
import {SteroidsFieldsEnum} from '../../domain/enums/SteroidsFieldsEnum';
import {IFieldsConfig} from '../interfaces/IFieldsConfig';
import {SteroidsFieldParamTypeEnum} from '../../domain/enums/SteroidsFieldParamTypeEnum';
import {CreateEntityFieldParamsDto} from '../../domain/dtos/CreateEntityFieldParamsDto';
import {IProjectInfo} from '../interfaces/IProjectInfo';
import {RelationTypeEnum} from '../../domain/enums/RelationTypeEnum';
import {DataMapper} from '@steroidsjs/nest/src/usecases/helpers/DataMapper';

const ENTITY_NAME_PLACEHOLDER = '%entityName%';
const TABLE_NAME_PLACEHOLDER = '%tableName%';

const MODEL_FIELDS_PLACEHOLDER = '%modelFields%';
const SAVE_DTO_FIELDS_PLACEHOLDER = '%saveDtoFields%';
const SEARCH_DTO_FIELDS_PLACEHOLDER = '%searchDtoFields%';
const DETAIL_SCHEMA_FIELDS_PLACEHOLDER = '%detailSchemaFields%';
const SEARCH_SCHEMA_FIELDS_PLACEHOLDER = '%searchSchemaFields%';

const MODEL_IMPORTS_PLACEHOLDER = '%modelImports%';
const SAVE_DTO_IMPORTS_PLACEHOLDER = '%saveDtoImports%';
const SEARCH_DTO_IMPORTS_PLACEHOLDER = '%searchDtoImports%';
const DETAIL_SCHEMA_IMPORTS_PLACEHOLDER = '%detailSchemaImports%';
const SEARCH_SCHEMA_IMPORTS_PLACEHOLDER = '%searchSchemaImports%';

const resultPaths = {
    model: 'domain/models/%entityName%Model.ts',
    repository: 'infrastructure/repositories/%entityName%Repository.ts',
    repositoryInterface: 'domain/interfaces/I%entityName%Repository.ts',
    table: 'infrastructure/tables/%entityName%Table.ts',
    service: 'domain/services/%entityName%Service.ts',
    saveDto: 'domain/dtos/%entityName%SaveDto.ts',
    searchDto: 'domain/dtos/%entityName%SearchDto.ts',
    detailSchema: 'infrastructure/schemas/%entityName%DetailSchema.ts',
    searchSchema: 'infrastructure/schemas/%entityName%SearchSchema.ts',
}

const templates = {
    model: 'ModelTemplate.txt',
    repository: 'RepositoryTemplate.txt',
    repositoryInterface: 'RepositoryInterfaceTemplate.txt',
    table: 'TableTemplate.txt',
    service: 'ServiceTemplate.txt',
    saveDto: 'SaveDtoTemplate.txt',
    searchDto: 'SearchDtoTemplate.txt',
    detailSchema: 'DetailSchemaTemplate.txt',
    searchSchema: 'SearchSchemaTemplate.txt',
}

export class EntityCodeGenerator {
    readonly entityName: string;
    readonly moduleName: string;
    readonly tableName: string;
    readonly projectRootPath: string
    readonly modulePath: string;
    readonly placeholdersValuesMap: Record<string, string> = {};
    readonly modelFields: string;
    readonly saveDtoFields: string;
    readonly searchDtoFields: string;
    readonly detailSchemaFields: string;
    readonly searchSchemaFields: string;

    private modelImports: string;
    private saveDtoImports: string;
    private searchDtoImports: string;
    private detailSchemaImports: string;
    private searchSchemaImports: string;

    readonly fieldsConfig: IFieldsConfig;
    readonly projectInfo: IProjectInfo;
    readonly createEntityDto: CreateEntityDto;

    constructor(
        entityName: string,
        moduleName: string,
        rootPath: string = null,
        createEntityDto?: CreateEntityDto,
        fieldsConfig?: IFieldsConfig,
        projectInfo?: IProjectInfo,
    ) {
        // set first letter in upper case if it's not
        this.entityName = this.capitalizeString(entityName);

        this.moduleName = moduleName;
        this.projectRootPath = rootPath || process.cwd();
        this.modulePath = this.findModulePath(moduleName);
        this.tableName = this.getTableName();
        this.fieldsConfig = fieldsConfig;
        this.projectInfo = projectInfo;
        this.createEntityDto = createEntityDto;

        let modelFieldsList = uniq(createEntityDto.fields.map(field => '   ' + field.type)).join(',\n');
        if (modelFieldsList.includes('RelationField') && !modelFieldsList.includes('RelationIdField')) {
            modelFieldsList += ',\n   RelationIdField';
        }
        this.modelImports = `import {\n${modelFieldsList}\n} from '@steroidsjs/nest/src/infrastructure/decorators/fields';\n`;

        this.modelFields = this.generateModelFields();
        this.saveDtoFields = this.generateSaveDtoFields('saveDto');
        this.searchDtoFields = this.generateSaveDtoFields('searchDto');
        this.detailSchemaFields = this.generateSaveDtoFields( 'detailSchema');
        this.searchSchemaFields = this.generateSaveDtoFields('searchSchema');

        this.placeholdersValuesMap = {
            [ENTITY_NAME_PLACEHOLDER]: this.entityName,
            [TABLE_NAME_PLACEHOLDER]: this.tableName,

            [MODEL_FIELDS_PLACEHOLDER]: this.modelFields,
            [SAVE_DTO_FIELDS_PLACEHOLDER]: this.saveDtoFields,
            [SEARCH_DTO_FIELDS_PLACEHOLDER]: this.searchDtoFields,
            [DETAIL_SCHEMA_FIELDS_PLACEHOLDER]: this.detailSchemaFields,
            [SEARCH_SCHEMA_FIELDS_PLACEHOLDER]: this.searchSchemaFields,

            [MODEL_IMPORTS_PLACEHOLDER]: this.modelImports,
            [SAVE_DTO_IMPORTS_PLACEHOLDER]: this.saveDtoImports,
            [SEARCH_DTO_IMPORTS_PLACEHOLDER]: this.searchDtoImports,
            [DETAIL_SCHEMA_IMPORTS_PLACEHOLDER]: this.detailSchemaImports,
            [SEARCH_SCHEMA_IMPORTS_PLACEHOLDER]: this.searchSchemaImports,
        }
    }

    public generate() {
        const allFileTypes = Object.keys(templates);

        for (const fileType of allFileTypes) {
            this.generateFileByType(fileType);
        }
    }

    private generateFileByType(fileType) {
        const templatePath = path.resolve(__dirname,  '../../../../public/templates');

        let resultFileContent = fs.readFileSync(
            path.resolve(templatePath, templates[fileType]),
            'utf8',
        );

        for (const placeholder in this.placeholdersValuesMap) {
            resultFileContent = resultFileContent.replace(
                new RegExp(`${escapeRegExp(placeholder)}`, 'g'),
                this.placeholdersValuesMap[placeholder],
            );
        }

        let resultFilePath = path.resolve(
            this.modulePath,
            resultPaths[fileType].replace(
                ENTITY_NAME_PLACEHOLDER,
                this.entityName,
            ),
        );

        const resultFileDirPath = path.dirname(resultFilePath);
        if (!fs.existsSync(resultFileDirPath)){
            fs.mkdirSync(resultFileDirPath, {recursive: true});
        }

        fs.writeFileSync(
            resultFilePath,
            resultFileContent,
        );
    }

    private findModulePath(moduleName) {
        let possibleModulePaths = [
            path.resolve(this.projectRootPath, 'src', moduleName),
            path.resolve(this.projectRootPath, moduleName),
        ]

        for (const path of possibleModulePaths) {
            if (fs.existsSync(path)) {
                return path;
            }
        }

        throw new Error('No module with a provided name is found');
    }

    private getTableName() {
        let tableName = snakeCase(this.entityName)
        const isTableNameContainsModuleName = (
            new RegExp(`^${this.moduleName}.*`)
        ).test(tableName);

        if (!isTableNameContainsModuleName) {
            tableName = this.moduleName + '_' + tableName;
        }

        return tableName;
    }

    private generateModelFields() {
        return this.createEntityDto.fields.map(field => this.generateModelField(field)).join('\n\n');
    }

    private generateModelField(field: CreateEntityFieldDto) {
        let params;
        switch (field.type) {
            case SteroidsFieldsEnum.RELATION_FIELD:
                return this.createRelationField(field);
            case SteroidsFieldsEnum.RELATION_ID_FIELD:
                return this.createRelationIdField(field);
            default:
                if (field.type === SteroidsFieldsEnum.ENUM_FIELD) {
                    this.modelImports += this.getImportForEntity(field.params.enum) + '\n';
                }
                params = this.fieldParamsToString(field.params, field.type);
                return `   @${field.type}(${params ? `{\n${params}\n   }` : ''})\n`
                    + `   ${field.name}: ${SteroidsFieldsEnum.getFieldType(field.type)};`;
        }
    }

    private createRelationField(field: CreateEntityFieldDto) {
        const isArray = [RelationTypeEnum.ONE_TO_MANY, RelationTypeEnum.MANY_TO_MANY].includes(field.params.type);
        const relationClass = field.params.relationClass;
        const inverseSideKey = field.params.inverseSide;
        delete field.params.relationClass;
        delete field.params.inverseSide;

        if (!this.modelImports.includes(`{${relationClass}}`)) {
            this.modelImports += this.getImportForEntity(relationClass) + '\n';
        }

        let params = this.fieldParamsToString(field.params, field.type);
        params += `,\n      relationClass: () => ${relationClass},`;
        if (inverseSideKey) {
            params += `\n      inverseSide: (model: ${relationClass}) => model.${inverseSideKey},`
        }

        let result = `   @${field.type}(${params ? `{\n${params}\n   }` : ''})\n`
            + `   ${field.name}: ${relationClass}${isArray ? '[]' : ''};`;

        const needToCreateRelationIdField = !this.createEntityDto.fields
            .find(otherField => otherField.type === SteroidsFieldsEnum.RELATION_ID_FIELD
                && otherField.params.relationName === field.name);
        if (needToCreateRelationIdField) {
            const fieldDto = DataMapper.create<CreateEntityFieldDto>(CreateEntityFieldDto, {
                name: `${field.name}Id${isArray ? 's' : ''}`,
                params: {
                    relationName: field.name,
                    isArray,
                },
            })
            result += '\n\n' + this.createRelationIdField(fieldDto);
        }

        return result;
    }

    private createRelationIdField(field: CreateEntityFieldDto) {
        return `   @RelationIdField({\n`
            + `      relationName: '${field.params.relationName}',\n${field.params.isArray ? '      isArray: true,\n' : ''}   })\n`
            + `   ${field.name}: number${field.params.isArray ? '[]' : ''};`;
    }

    private fieldParamsToString(params: CreateEntityFieldParamsDto, fieldType: string) {
    if (
        fieldType === SteroidsFieldsEnum.RELATION_FIELD
        && [RelationTypeEnum.MANY_TO_ONE, RelationTypeEnum.ONE_TO_MANY].includes(params.type)) {
        delete params.isOwningSide;
    }
    return Object.entries(params || {}).map(([param, paramValue]) => {
            const paramType = this.fieldsConfig
                .find(fieldConfig => fieldType === fieldConfig.name)
                .params.find(option => option.name === param)
                ?.type;

            if (!paramType || (!paramValue && !isBoolean(paramValue))) {
                return null;
            }

            let value = paramValue;
            if ([SteroidsFieldParamTypeEnum.STRING, SteroidsFieldParamTypeEnum.RELATION_TYPE,].includes(paramType)) {
                value = `'${paramValue}'`;
            }

            return `      ${param}: ${value}`;
        })
        .filter(Boolean)
        .join(',\n')
    }

    private generateSaveDtoFields(
        dtoType: 'saveDto' | 'searchDto' | 'detailSchema' | 'searchSchema',
    ) {
        this[`${dtoType}Imports`] = uniq(this.createEntityDto.fields
            .map(field => {
                const dtoClass = field.additionalParams?.[`${dtoType}Class`];
                if (!dtoClass) {
                    return null;
                }
                return dtoClass ? this.getImportForEntity(dtoClass) : null
            })
            .filter(Boolean)
        ).join('\n');

        return this.createEntityDto.fields
            .filter(field => {
                switch (dtoType) {
                    case 'saveDto':
                        return field.addToSaveDto;
                    case 'searchDto':
                        return field.addToSearchDto;
                    case 'searchSchema':
                        return field.addToSearchSchema;
                    case 'detailSchema':
                        return field.addToDetailSchema;
                    default: return false;
                }
            })
            .map(field => this.generateDtoField(field, this.createEntityDto.entityName, dtoType)).join('\n\n');
    }

    private getImportForEntity(entityName: string): string {
        const relationClassInfo = this.projectInfo.allEntities.find(entity => entity.name === entityName);
        const relationClassPath = relationClassInfo.path
            .split('/src/')[1]
            ?.replace('.ts', '');
        return `import {${entityName}} from 'src/${relationClassPath}';`;
    }

    private generateDtoField(
        field: CreateEntityFieldDto,
        entityName: string,
        dtoType: 'saveDto' | 'searchDto' | 'detailSchema' | 'searchSchema',
    ) {
        switch (field.type) {
            case SteroidsFieldsEnum.RELATION_FIELD:
                const relationClass = field.additionalParams[`${dtoType}Class`];
                return `   @ExtendField(${this.capitalizeString(entityName)}Model, {\n`
                    + `      relationClass: () => ${relationClass},\n`
                    + `   })\n`
                    + `   ${field.name}: ${relationClass};`;
            default:
                return `   @ExtendField(${this.capitalizeString(entityName)}Model)\n`
                    + `   ${field.name}: ${SteroidsFieldsEnum.getFieldType(field.type)};`;
        }
    }

    private capitalizeString(string: string) {
        if (string[0].toUpperCase() !== string[0]) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        } else {
            return string;
        }
    }
}
