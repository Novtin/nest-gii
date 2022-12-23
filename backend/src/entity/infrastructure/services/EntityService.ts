import * as fs from 'fs';
import * as path from 'path';
import * as ts from "typescript";
import {CreateEntityDto} from '../../domain/dtos/CreateEntityDto';
import {EntityCodeGenerator} from './EntityCodeGenerator';
import {IFieldsConfig} from '../interfaces/IFieldsConfig';
import {SteroidsFieldParamTypeEnum} from '../../domain/enums/SteroidsFieldParamTypeEnum';
import {ValidationHelper} from '@steroidsjs/nest/src/usecases/helpers/ValidationHelper';
import {SyntaxKind} from 'typescript';
import {IProjectDtoEntity, IProjectInfo} from '../interfaces/IProjectInfo';
import {DataMapper} from '@steroidsjs/nest/src/usecases/helpers/DataMapper';

export class EntityService {
    constructor() {
    }

    private parseTypescriptValue (initializer: any) {
        switch (initializer.kind) {
            case SyntaxKind.TrueKeyword:
                return true;
            case SyntaxKind.FalseKeyword:
                return false;
            default:
                return initializer?.text || initializer?.body?.escapedText || initializer?.body?.name?.escapedText;
        }
    }

    public async parseEntityFields(entityInfo: IProjectDtoEntity) {
        const text = fs.readFileSync(entityInfo.path).toString();
        const ast: any = ts.createSourceFile('test.ts', text, ts.ScriptTarget.Latest).statements;
        const classNode = ast.find(node => node.name?.escapedText === entityInfo.name);
        const fieldsNodes = classNode.members;
        const fields = fieldsNodes.map(fieldNode => ({
            type: fieldNode.decorators[0]?.expression?.expression?.escapedText,
            name: fieldNode.name?.escapedText,
            params: fieldNode.decorators?.[0]?.expression?.arguments?.[0]?.properties?.reduce((result, property) => ({
                ...result,
                [property.name?.escapedText]: this.parseTypescriptValue(property.initializer),
            }), {}),
        })).filter(Boolean);
        // console.log(fields);
        // console.log(util.inspect(fieldsNodes[7].decorators[0].expression.arguments[0].properties[3], {depth: null, colors: true}));
        return fields;
    }

    public async getModelInitialValues(modelName: string) {
        const projectInfo = await this.getProjectInfo();
        const projectEntity = projectInfo.allEntities.find(entity => entity.name === modelName);
        const modelFields = await this.parseEntityFields(projectEntity);
        const result = DataMapper.create<CreateEntityDto>(CreateEntityDto, {
            moduleName: projectEntity.module,
            entityName: modelName,
            fields: modelFields,
        });
        return result;
    }

    public async create(dto: CreateEntityDto) {
        // await ValidationHelper.validate(dto);
        (new EntityCodeGenerator(
            dto.entityName,
            dto.moduleName,
            null,
            dto,
            this.getFieldsConfig(),
            await this.getProjectInfo(),
        )).generate();
    }

    public async update(modelName: string, dto: CreateEntityDto) {

    }

    public async getProjectInfo(): Promise<IProjectInfo> {
        const projectRootPath = process.cwd();
        const objects = fs.readdirSync(path.resolve(projectRootPath, 'src'));
        const result: IProjectInfo = {
            modules: [],
            allEntities: [],
        };
        for (const object of objects) {
            if (!object.includes('.')) {
                result.modules.push({
                    name: object,
                });
            }
        }

        const entitiesToScan = [
            {name: 'models', level: 'domain'},
            {name: 'enums', level: 'domain'},
            {name: 'dtos', level: 'domain'},
            {name: 'schemas', level: 'infrastructure'},
        ];
        for (const module of result.modules) {
            for (const entity of entitiesToScan) {
                try {
                    const entityDirectory = path.resolve(projectRootPath, 'src', module.name, entity.level, entity.name);
                    const entityFiles = fs.readdirSync(entityDirectory);
                    module[entity.name] = entityFiles
                        .filter(file => file.endsWith('.ts'))
                        .map(file => ({
                            name: file.replace('.ts', ''),
                            path: path.resolve(entityDirectory, file),
                            module: module.name,
                            type: entity.name.slice(0, -1),
                        }));
                    result.allEntities.push(...module[entity.name]);
                } catch (e) {}
            }
        }
        return result;
    }

    public getFieldsConfig(): IFieldsConfig {
        const defaultParams = [
            {label: 'Label', name: 'label', type: SteroidsFieldParamTypeEnum.STRING, isRequired: false},
            {label: 'Nullable', name: 'nullable', type: SteroidsFieldParamTypeEnum.BOOLEAN, isRequired: false},
            {label: 'Required', name: 'required', type: SteroidsFieldParamTypeEnum.BOOLEAN, isRequired: false},
        ];

        return [
            {name: 'StringField', params: [
                    ...defaultParams,
                    {label: 'Min', name: 'min', type: SteroidsFieldParamTypeEnum.NUMBER, isRequired: false},
                    {label: 'Max', name: 'max', type: SteroidsFieldParamTypeEnum.NUMBER, isRequired: false},
                    {label: 'Default value', name: 'defaultValue', type: SteroidsFieldParamTypeEnum.STRING, isRequired: false},
                ]},
            {name: 'IntegerField', params: [
                    ...defaultParams,
                    {label: 'Min', name: 'min', type: SteroidsFieldParamTypeEnum.NUMBER, isRequired: false},
                    {label: 'Max', name: 'max', type: SteroidsFieldParamTypeEnum.NUMBER, isRequired: false},
                    {label: 'Default value', name: 'defaultValue', type: SteroidsFieldParamTypeEnum.NUMBER, isRequired: false},
                ]},
            {name: 'BooleanField', params: [
                    ...defaultParams,
                    {label: 'Default value', name: 'defaultValue', type: SteroidsFieldParamTypeEnum.BOOLEAN, isRequired: false},
                ]},
            {name: 'CreateTimeField', params: [
                    {label: 'Label', name: 'label', type: SteroidsFieldParamTypeEnum.STRING, isRequired: false},
                ]},
            {name: 'UpdateTimeField', params: [
                    {label: 'Label', name: 'label', type: SteroidsFieldParamTypeEnum.STRING, isRequired: false},
                ]},
            {name: 'DateField', params: defaultParams},
            {name: 'DateTimeField', params: defaultParams},
            {name: 'DecimalField', params: [
                    ...defaultParams,
                    {label: 'Min', name: 'min', type: SteroidsFieldParamTypeEnum.NUMBER, isRequired: false},
                    {label: 'Max', name: 'max', type: SteroidsFieldParamTypeEnum.NUMBER, isRequired: false},
                    {label: 'Default value', name: 'defaultValue', type: SteroidsFieldParamTypeEnum.NUMBER, isRequired: false},
                ]},
            {name: 'EmailField', params: defaultParams},
            {name: 'EnumField', params: [...defaultParams, {
                    label: 'Словарь', name: 'enum', type: SteroidsFieldParamTypeEnum.ENUM, isRequired: true,
                }]},
            {name: 'ExtendField', params: [
                    {label: 'Extend class', name: 'extendClass', type: SteroidsFieldParamTypeEnum.ANY_ENTITY, isRequired: true},
                    {label: 'Relation class', name: 'relationClass', type: SteroidsFieldParamTypeEnum.ANY_ENTITY, isRequired: false},
                ]},
            {name: 'FileField', params: defaultParams},
            {name: 'HtmlField', params: defaultParams},
            {name: 'ImageField', params: defaultParams},
            {name: 'PasswordField', params: defaultParams},
            {name: 'PhoneField', params: defaultParams},
            {name: 'RelationField',
                params: [
                    {label: 'Label', name: 'label', type: SteroidsFieldParamTypeEnum.STRING, isRequired: false},
                    {label: 'Тип', name: 'type', type: SteroidsFieldParamTypeEnum.RELATION_TYPE, isRequired: true},
                    {label: 'Модель', name: 'relationClass', type: SteroidsFieldParamTypeEnum.MODEL, isRequired: true},
                    {label: 'isOwningSide', name: 'isOwningSide', type: SteroidsFieldParamTypeEnum.BOOLEAN, isRequired: false},
                    {label: 'inverseSide', name: 'inverseSide', type: SteroidsFieldParamTypeEnum.STRING, isRequired: false},
                ],
                additionalParams: [
                    {label: 'SaveDto class', name: 'saveDtoClass', type: SteroidsFieldParamTypeEnum.DTO, isRequired: false},
                    {label: 'SearchDto class', name: 'searchDtoClass', type: SteroidsFieldParamTypeEnum.DTO, isRequired: false},
                    {label: 'DetailSchema class', name: 'detailSchemaClass', type: SteroidsFieldParamTypeEnum.SCHEMA, isRequired: false},
                    {label: 'SearchSchema class', name: 'searchSchemaClass', type: SteroidsFieldParamTypeEnum.SCHEMA, isRequired: false},
                ],
            },
            {name: 'RelationIdField',
                params: [
                    {label: 'Relation name', name: 'relationName', type: SteroidsFieldParamTypeEnum.STRING, isRequired: true},
                    {label: 'isArray', name: 'isArray', type: SteroidsFieldParamTypeEnum.BOOLEAN, isRequired: false},
                ]},
            {name: 'TextField', params: [
                    ...defaultParams,
                    {label: 'Min', name: 'min', type: SteroidsFieldParamTypeEnum.NUMBER, isRequired: false},
                    {label: 'Max', name: 'max', type: SteroidsFieldParamTypeEnum.NUMBER, isRequired: false},
                    {label: 'Default value', name: 'defaultValue', type: SteroidsFieldParamTypeEnum.STRING, isRequired: false},
                ]},
            {name: 'TimeField', params: defaultParams},
            {name: 'UidField', params: defaultParams},
            {name: 'PrimaryKeyField', params: [
                    {label: 'Label', name: 'label', type: SteroidsFieldParamTypeEnum.STRING, isRequired: false},
                ]},
        ];
    }
 }

// const array = [...text.matchAll(/@.*Field([^@]+;\n)*/gm)];
// const fieldsStrings = array.map(item => item[0] .replace(/\n|\s*/g, ''));
// console.log(fieldsStrings.map(fieldString => ({
//     field: fieldString.match(/@[^(]*Field/gm)[0]?.replace('@', ''),
//     params: fieldString.match(/Field\(.*\)/gm)[0]
//         ?.replace('Field(', '')
//         .slice(0, -1),
//     name:  fieldString.match(/[A-Za-z]+:[A-Za-z]+;$/g)[0]
//         ?.split(':')?.[0],
// })));
