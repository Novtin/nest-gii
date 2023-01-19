import {StringField} from '@steroidsjs/nest/src/infrastructure/decorators/fields';

export class CreateReduxStoreDto {
    @StringField()
    name: string;
}
