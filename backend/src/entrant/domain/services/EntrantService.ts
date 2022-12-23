import {CrudService} from '@steroidsjs/nest/src/usecases/services/CrudService';
import {EntrantSearchDto} from '../dtos/EntrantSearchDto';
import {EntrantSaveDto} from '../dtos/EntrantSaveDto';
import {EntrantModel} from '../models/EntrantModel';
import {IEntrantRepository} from '../interfaces/IEntrantRepository';

export class EntrantService extends CrudService<EntrantModel, EntrantSearchDto, EntrantSaveDto> {
    protected modelClass = EntrantModel;

    constructor(
        /** EntrantRepository */
        public repository: IEntrantRepository,
    ) {
        super();
    }
}
