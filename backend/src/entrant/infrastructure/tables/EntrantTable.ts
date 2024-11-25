import {TableFromModel} from '@steroidsjs/nest/src/infrastructure/decorators/TableFromModel';
import {EntrantModel} from '../../domain/models/EntrantModel';

@TableFromModel(EntrantModel, 'entrant')
export class EntrantTable extends EntrantModel {}
