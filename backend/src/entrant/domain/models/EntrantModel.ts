import {PrimaryKeyField} from '@steroidsjs/nest/src/infrastructure/decorators/fields';

export class EntrantModel {
    @PrimaryKeyField()
    id: number;
}
