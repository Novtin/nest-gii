import {Body, Controller, Post} from '@nestjs/common';
import {ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {ContextDto} from '@steroidsjs/nest/src/usecases/dtos/ContextDto';
import {Context} from '@steroidsjs/nest/src/infrastructure/decorators/Context';
import {AuthInitSchema} from '../schemas/AuthInitSchema';
import {UserService} from '../../../user/domain/services/UserService';
import getExportedEnums from '../helpers/getExportedEnums';
import getExportedModels from '../helpers/getExportedModels';
import {InitRequestDto} from '../../usecases/dtos/InitRequestDto';
import {exportEnums, exportModels} from '../helpers/entitiesExporter';

@ApiTags('Авторизация')
@Controller('/init')
export class InitController {
    constructor(
        private userService: UserService,
    ) {}

    @Post()
    @ApiOkResponse({type: AuthInitSchema})
    async init(
        @Context() context: ContextDto,
        @Body() dto: InitRequestDto,
    ) {
        const user = context.user?.id ? await this.userService.findById(context.user.id) : null;

        const exportedEnums = exportEnums(getExportedEnums());

        return {
            user,
            meta: {
                ...exportedEnums,
            },
        };
    }
}
