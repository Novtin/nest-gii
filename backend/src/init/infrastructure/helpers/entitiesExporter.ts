import {getFieldOptions, getMetaFields} from '@steroidsjs/nest/src/infrastructure/decorators/fields/BaseField';
import {DECORATORS} from '@nestjs/swagger/dist/constants';
import {IRelationFieldOptions} from '@steroidsjs/nest/src/infrastructure/decorators/fields/RelationField';

interface IFieldData {
    attribute: any;
    type: string;
    label: string;
    required: boolean;
    items?: any,
    modelClass?: string,
}

function exportEnum(enumClass) {
    const labels = enumClass
        .toArray()
        .map((enumElement: {id: string, label: string}) => ({
            id: enumElement.id,
            label: enumElement.label,
        }));
    return {
        labels,
    };
}

function extractModelAttribute(modelClass, fieldName) {
    const apiMeta = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES, modelClass.prototype, fieldName);
    const options = getFieldOptions(modelClass, fieldName);

    const fieldData: IFieldData = {
        attribute: fieldName,
        type: options.appType || 'string',
        label: options.label || apiMeta.description,
        required: apiMeta.required,
        ...(options.enum
            ? {
                items: (Array.isArray(options.enum) ? options.enum[0] : options.enum).name,
            }
            : {}),
    };

    if (fieldData.type === 'relation') {
        fieldData.modelClass = (options as IRelationFieldOptions).relationClass().name;
    }

    return fieldData;
}

function exportModel(modelClass) {
    const fieldNames = getMetaFields(modelClass);
    return {
        attributes: fieldNames.map(fieldName => extractModelAttribute(modelClass, fieldName)),
    };
}

export function exportEnums(enums: any[]) {
    const arrayableEnums = enums.filter(type => type.toArray);

    const result = {};
    for (const exportedEnum of arrayableEnums) {
        result[exportedEnum.name] = exportEnum(exportedEnum);
    }
    return result;
}

export function exportModels(models: any[]) {
    const result = {};
    for (const model of models) {
        result[model.name] = exportModel(model);
    }
    return result;
}
