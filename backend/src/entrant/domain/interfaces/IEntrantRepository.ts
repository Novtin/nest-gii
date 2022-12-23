import {ICrudRepository} from '@steroidsjs/nest/src/usecases/interfaces/ICrudRepository';
import {EntrantModel} from '../models/EntrantModel';

export const IEntrantRepository = 'IEntrantRepository';

export type IEntrantRepository = ICrudRepository<EntrantModel>
