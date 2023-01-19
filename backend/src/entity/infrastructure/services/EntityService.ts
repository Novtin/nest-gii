import * as fs from 'fs';
import * as ts from "typescript";
import {CreateEntityDto} from '../../domain/dtos/CreateEntityDto';
import {BackendEntityCodeGenerator} from '../generators/BackendEntityCodeGenerator';
import {IFieldsConfig} from '../interfaces/IFieldsConfig';
import {SteroidsFieldParamTypeEnum} from '../../domain/enums/SteroidsFieldParamTypeEnum';
import {SyntaxKind} from 'typescript';
import {IBackendDtoEntity} from '../interfaces/IBackendRepositoryInfo';
import {DataMapper} from '@steroidsjs/nest/src/usecases/helpers/DataMapper';
import {ProjectService} from './ProjectService';
import {forwardRef, Inject} from '@nestjs/common';
import {RepositoryService} from './RepositoryService';

export class EntityService {
    constructor(
        @Inject(forwardRef(() => ProjectService))
        private projectService: ProjectService,

        @Inject(forwardRef(() => RepositoryService))
        private repositoryService: RepositoryService,
    ) {}

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

    public async parseEntityFields(entityInfo: IBackendDtoEntity) {
        const text = fs.readFileSync(entityInfo.path).toString();
        const ast: any = ts.createSourceFile('thisFileWillNotBeCreated.ts', text, ts.ScriptTarget.Latest).statements;
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
        return fields;
    }

    public async getModelInitialValues(repositoryUid: string, modelName: string) {
        const repositoryInfo = await this.repositoryService.getInfoByUid(repositoryUid);
        const projectEntity = repositoryInfo.allEntities.find(entity => entity.name === modelName);
        const modelFields = await this.parseEntityFields(projectEntity);
        const result = DataMapper.create<CreateEntityDto>(CreateEntityDto, {
            moduleName: projectEntity.module,
            entityName: modelName,
            fields: modelFields,
        });
        return result;
    }

    public async create(dto: CreateEntityDto, repositoryUid: string) {
        const repository = this.repositoryService.get(repositoryUid);
        // await ValidationHelper.validate(dto);
        (new BackendEntityCodeGenerator(
            dto.entityName,
            dto.moduleName,
            repository.path,
            dto,
            this.getFieldsConfig(),
            await this.repositoryService.getInfoByUid(repositoryUid),
        )).generate();
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
