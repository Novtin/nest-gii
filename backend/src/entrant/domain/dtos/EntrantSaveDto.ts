import {ExtendField} from '@steroidsjs/nest/src/infrastructure/decorators/fields/ExtendField';
import {EntrantModel} from '../models/EntrantModel';

export class EntrantSaveDto {
    @ExtendField(EntrantModel)
    id: number;
}
