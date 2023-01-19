import {Body, Controller, Get, Inject, Param, Post} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {CreateRepositoryDto} from '../../domain/dtos/CreateRepositoryDto';
import {RepositoryService} from '../services/RepositoryService';

@ApiTags('Репозитории')
@Controller('/project/:projectName/repository')
export class RepositoryController {
    constructor(
        @Inject(RepositoryService)
        private repositoryService: RepositoryService,
    ) {}

    @Get('/:uid')
    async getInfo(
        @Param('uid') uid: string,
    ) {
        return this.repositoryService.getInfoByUid(uid);
    }

    @Post()
    async create(
        @Body() dto: CreateRepositoryDto,
        @Param('projectName') projectName: string,
    ) {
        return this.repositoryService.create(projectName, dto);
    }
}
