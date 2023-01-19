import {CrudService} from '@steroidsjs/nest/src/usecases/services/CrudService';
import {TestSearchDto} from '../dtos/TestSearchDto';
import {TestSaveDto} from '../dtos/TestSaveDto';
import {TestModel} from '../models/TestModel';
import {ITestRepository} from '../interfaces/ITestRepository';

export class TestService extends CrudService<TestModel, TestSearchDto, TestSaveDto> {
    protected modelClass = TestModel;

    constructor(
        /** TestRepository */
        public repository: ITestRepository,
    ) {
        super();
    }
}
