import {Body, Controller, Inject, Param, Post, Get} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {EntityService} from '../services/EntityService';
import {CreateEntityDto} from '../../domain/dtos/CreateEntityDto';
import * as util from 'util';

@ApiTags('Модели')
@Controller('/entity')
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
    ) {
        console.log(util.inspect(dto, {depth: null, colors: true}));
        return this.entityService.create(dto);
    }

    @Get('/:name')
    // @ApiOkResponse({type: })
    async get(
        @Param('name') name: string,
    ) {
        return this.entityService.getModelInitialValues(name);
    }
}
