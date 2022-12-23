import {BooleanField, IntegerField, StringField} from '@steroidsjs/nest/src/infrastructure/decorators/fields';

export class CreateEntityFieldParamsDto {
    @StringField()
    label?: string;

    @IntegerField()
    min?: number;

    @IntegerField()
    max?: number;

    @BooleanField()
    nullable?: boolean;

    @StringField()
    relationClass?: string;

    @BooleanField()
    isOwningSide?: boolean;

    @StringField()
    type?: string;

    @StringField()
    enum?: string;

    @StringField()
    inverseSide?: string;

    @StringField()
    relationName?: string;

    @BooleanField()
    isArray?: boolean;

    @StringField()
    defaultValue?: string;

    @BooleanField()
    required?: boolean;
}
