import {Repository} from '@steroidsjs/typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@steroidsjs/nest-typeorm';
import {CrudRepository} from '@steroidsjs/nest/src/infrastructure/repositories/CrudRepository';
import {TestModel} from '../../domain/models/TestModel';
import {TestTable} from '../tables/TestTable';

@Injectable()
export class TestRepository extends CrudRepository<TestModel> {
    constructor(
        @InjectRepository(TestTable)
        public dbRepository: Repository<TestTable>,
    ) {
        super();
    }

    protected modelClass = TestModel;
}
