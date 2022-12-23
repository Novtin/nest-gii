import {IDeepPartial} from '@steroidsjs/nest/src/usecases/interfaces/IDeepPartial';
import {TableFromModel} from '@steroidsjs/nest/src/infrastructure/decorators/TableFromModel';
import {EntrantModel} from '../../domain/models/EntrantModel';

@TableFromModel(EntrantModel, 'entrant')
export class EntrantTable implements IDeepPartial<EntrantModel> {}
