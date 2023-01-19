import {Module} from '@nestjs/common';
import {EntityController} from './controllers/EntityController';
import {EntityService} from './services/EntityService';
import {ProjectService} from './services/ProjectService';
import {ProjectController} from './controllers/ProjectController';
import {RepositoryService} from './services/RepositoryService';
import {ConfigModule} from '@nestjs/config';
import {RepositoryController} from './controllers/RepositoryController';
import {ReduxStoreService} from './services/ReduxStoreService';
import {ReduxStoreController} from './controllers/ReduxStoreController';

@Module({
    imports: [
        ConfigModule,
    ],
    controllers: [
        EntityController,
        ProjectController,
        RepositoryController,
        ReduxStoreController,
    ],
    providers: [
        EntityService,
        ProjectService,
        RepositoryService,
        ReduxStoreService,
    ],
    exports: [
        EntityService,
        ProjectService,
    ],
})
export class EntityModule {}
