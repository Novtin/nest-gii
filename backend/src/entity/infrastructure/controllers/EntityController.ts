import {Body, Controller, Inject, Param, Post, Get} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {EntityService} from '../services/EntityService';
import {CreateEntityDto} from '../../domain/dtos/CreateEntityDto';

@ApiTags('Модели')
@Controller('/project/:projectName/repository/:uid/entity')
export class EntityController {
    constructor(
        @Inject(EntityService)
        private entityService: EntityService,
    ) {
    }

    @Post()
    // @ApiOkResponse({type: })
    async create(
        @Body() dto: CreateEntityDto,
        @Param('uid') uid: string,
    ) {
        return this.entityService.create(dto, uid);
    }

    @Get('/:name')
    // @ApiOkResponse({type: })
    async get(
        @Param('name') name: string,
        @Param('uid') uid: string,
    ) {
        return this.entityService.getModelInitialValues(uid, name);
    }
}
