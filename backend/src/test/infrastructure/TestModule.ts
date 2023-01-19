import {Module} from '@nestjs/common';
import {ModuleHelper} from '@steroidsjs/nest/src/infrastructure/helpers/ModuleHelper';
import {TestRepository} from './repositories/TestRepository';
import {ITestRepository} from '../domain/interfaces/ITestRepository';
import {TestService} from '../domain/services/TestService';

@Module({
   imports: [
   ],
   controllers: [
   ],
   providers: [
      {
         provide: ITestRepository,
         useClass: TestRepository,
      },

      ModuleHelper.provide(TestService, [
         ITestRepository,
      ]),
   ],
})
export class TestModule {}
