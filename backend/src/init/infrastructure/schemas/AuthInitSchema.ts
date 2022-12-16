import {ApiProperty} from '@nestjs/swagger';
import {UserSchema} from '../../../user/infrastructure/schemas/UserSchema';

export class AuthInitSchema {
    @ApiProperty()
    readonly user: UserSchema;
}
