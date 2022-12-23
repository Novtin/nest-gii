import {Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CrudRepository} from '@steroidsjs/nest/src/infrastructure/repositories/CrudRepository';
import {EntrantModel} from '../../domain/models/EntrantModel';
import {EntrantTable} from '../tables/EntrantTable';

@Injectable()
export class EntrantRepository extends CrudRepository<EntrantModel> {
    constructor(
        @InjectRepository(EntrantTable)
        public dbRepository: Repository<EntrantTable>,
    ) {
        super();
    }

    protected modelClass = EntrantModel;
}
