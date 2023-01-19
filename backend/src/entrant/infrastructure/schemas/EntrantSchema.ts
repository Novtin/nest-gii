import {ExtendField} from '@steroidsjs/nest/src/infrastructure/decorators/fields/ExtendField';
import {EntrantModel} from '../../domain/models/EntrantModel';

export class EntrantSchema {
    @ExtendField(EntrantModel)
    id: number;
}
