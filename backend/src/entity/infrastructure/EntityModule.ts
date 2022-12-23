import {Module} from '@nestjs/common';
import {EntityController} from './controllers/EntityController';
import {EntityService} from './services/EntityService';

@Module({
    imports: [
    ],
    controllers: [
        EntityController,
    ],
    providers: [
        EntityService,
    ],
    exports: [
        EntityService,
    ],
})
export class EntityModule {}
