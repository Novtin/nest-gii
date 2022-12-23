import {Module} from '@nestjs/common';
import {InitController} from './controllers/InitController';
import {EntityModule} from '../../entity/infrastructure/EntityModule';

@Module({
    imports: [
        EntityModule,
    ],
    controllers: [
        InitController,
    ],
})
export class InitModule {}
