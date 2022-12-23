export default () => ({
    name: 'steroidsNestGii',
    title: 'Steroids Nest Gii',
    version: '1.0',
    port: parseInt(process.env.NEST_GII_BACKEND_PORT, 10),
    cors: {
        allowDomains: [
            '127.0.0.1:' + process.env.NEST_GII_FRONTEND_PORT,
            'localhost:' + process.env.NEST_GII_FRONTEND_PORT,
        ],
    },
});
