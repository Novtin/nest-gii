import {TableFromModel} from '@steroidsjs/nest/src/infrastructure/decorators/TableFromModel';
import {TestModel} from '../../domain/models/TestModel';

@TableFromModel(TestModel, 'Test_test')
export class TestTable extends TestModel {}
