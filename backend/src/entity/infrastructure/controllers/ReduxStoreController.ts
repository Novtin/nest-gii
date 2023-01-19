import {Body, Controller, Inject, Param, Post} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {ReduxStoreService} from '../services/ReduxStoreService';
import {CreateReduxStoreDto} from '../../domain/dtos/CreateReduxStoreDto';

@ApiTags('Redux store')
@Controller('/project/:projectName/repository/:uid/redux')
export class ReduxStoreController {
    constructor(
        @Inject(ReduxStoreService)
        private reduxStoreService: ReduxStoreService,
    ) {
    }

    @Post()
    async create(
        @Body() dto: CreateReduxStoreDto,
        @Param('uid') uid: string,
    ) {
        return this.reduxStoreService.create(dto, uid);
    }
}
