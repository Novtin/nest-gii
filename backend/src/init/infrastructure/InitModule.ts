import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {InitController} from './controllers/InitController';
import {UserModule} from '../../user/infrastructure/UserModule';

@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('auth.jwtSecretKey'),
            }),
        }),
    ],
    controllers: [
        InitController,
    ],
})
export class InitModule {}
