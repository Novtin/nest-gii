import {ICrudRepository} from '@steroidsjs/nest/src/usecases/interfaces/ICrudRepository';
import {TestModel} from '../models/TestModel';

export const ITestRepository = 'ITestRepository';

export type ITestRepository = ICrudRepository<TestModel>
