import {Body, Controller, Inject, Post} from '@nestjs/common';
import {ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {ContextDto} from '@steroidsjs/nest/src/usecases/dtos/ContextDto';
import {Context} from '@steroidsjs/nest/src/infrastructure/decorators/Context';
import {AuthInitSchema} from '../schemas/AuthInitSchema';
import getExportedEnums from '../helpers/getExportedEnums';
import {InitRequestDto} from '../../usecases/dtos/InitRequestDto';
import {exportEnums, exportModels} from '../helpers/entitiesExporter';
import {EntityService} from '../../../entity/infrastructure/services/EntityService';

@ApiTags('Авторизация')
@Controller('/init')
export class InitController {
    constructor(
        @Inject(EntityService)
        protected entityService: EntityService,
    ) {}

    @Post()
    @ApiOkResponse({type: AuthInitSchema})
    async init(
        @Context() context: ContextDto,
        @Body() dto: InitRequestDto,
    ) {
        const exportedEnums = exportEnums(getExportedEnums());

        return {
            project: await this.entityService.getProjectInfo(),
            fields: this.entityService.getFieldsConfig(),
            meta: {
                ...exportedEnums,
            },
        };
    }
}
