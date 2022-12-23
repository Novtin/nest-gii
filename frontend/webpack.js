require('./envInit');

require('@steroidsjs/webpack').config({
    port: process.env.NEST_GII_FRONTEND_PORT,
});
