import {join} from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// We need this environment variables for application init in AppModule,
// so we don't move these variables into ConfigService
// Possible solution: provide modules that require these variables using Nest Dynamic Modules
// https://docs.nestjs.com/fundamentals/dynamic-modules
process.env.APP_ENVIRONMENT = process.env.APP_ENVIRONMENT || 'dev';
process.env.APP_ROOT_FILES_DIR = process.env.APP_ROOT_FILES_DIR || join(process.cwd(), 'files');
process.env.APP_STATIC_URL_PREFIX = '/files';
