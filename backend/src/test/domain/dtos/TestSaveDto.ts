import {ExtendField} from '@steroidsjs/nest/src/infrastructure/decorators/fields/ExtendField';
import {TestModel} from '../models/TestModel';


export class TestSaveDto {
   @ExtendField(TestModel)
   id: number;
}
