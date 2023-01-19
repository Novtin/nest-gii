import {Body, Controller, Get, Inject, Param, Post} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {ProjectService} from '../services/ProjectService';
import {SaveProjectDto} from '../../domain/dtos/SaveProjectDto';
import {CreateRepositoryDto} from '../../domain/dtos/CreateRepositoryDto';

@ApiTags('Проекты')
@Controller('/project')
export class ProjectController {
    constructor(
        @Inject(ProjectService)
        private projectService: ProjectService,
    ) {}

    @Post()
    async create(
        @Body() dto: SaveProjectDto,
    ) {
        return this.projectService.create(dto.name);
    }
}
