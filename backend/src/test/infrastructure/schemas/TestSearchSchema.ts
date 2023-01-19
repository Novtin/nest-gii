import {ExtendField} from '@steroidsjs/nest/src/infrastructure/decorators/fields/ExtendField';
import {TestModel} from '../../domain/models/TestModel';


export class TestSearchSchema {
   @ExtendField(TestModel)
   id: number;
}
