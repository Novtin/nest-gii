const dotenv = require('dotenv');

dotenv.config({ path: './../.env' });

process.env.APP_BACKEND_URL='http://localhost:' + process.env.NEST_GII_BACKEND_PORT;
