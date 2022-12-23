import {StringField} from '@steroidsjs/nest/src/infrastructure/decorators/fields';

export class CreateEntityFieldAdditionalParamsDto {
    @StringField()
    saveDtoClass: string;

    @StringField()
    searchDtoClass: string;

    @StringField()
    detailSchemaClass: string;

    @StringField()
    searchSchemaClass: string;
}
