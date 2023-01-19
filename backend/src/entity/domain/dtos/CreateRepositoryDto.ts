import {EnumField, StringField} from '@steroidsjs/nest/src/infrastructure/decorators/fields';
import {RepositoryTypeEnum} from '../enums/RepositoryTypeEnum';

export class CreateRepositoryDto {
    @StringField()
    name: string;

    @StringField()
    path: string;

    @EnumField({
        enum: RepositoryTypeEnum,
    })
    type: string;

    @StringField()
    uid?: string;
}
