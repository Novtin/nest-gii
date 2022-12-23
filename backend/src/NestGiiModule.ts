import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {CommandModule} from 'nestjs-command';
import {ScheduleModule} from '@nestjs/schedule';
import { APP_FILTER } from '@nestjs/core';
import config from './config';
import {ValidationExceptionFilterCustom} from './base/infrastructure/filters/ValidationExceptionFilterCustom';
import {RequestExecutionExceptionFilter} from './base/infrastructure/filters/RequestExecutionExceptionFilter';
import {InitModule} from './init/infrastructure/InitModule';
import {EntityModule} from './entity/infrastructure/EntityModule';
import {EntityCodeGenerateCommand} from './entity/infrastructure/commands/EntityCodeGenerateCommand';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: config,
        }),
        ScheduleModule.forRoot(),
        InitModule,
        CommandModule,
        EntityModule,
    ].filter(Boolean),
    providers: [
        EntityCodeGenerateCommand,
        {
            provide: APP_FILTER,
            useClass: ValidationExceptionFilterCustom,
        },
        {
            provide: APP_FILTER,
            useClass: RequestExecutionExceptionFilter,
        },
    ],
})
export class NestGiiModule {
}
