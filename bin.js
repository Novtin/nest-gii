#!/usr/bin/env node
const { spawn } = require("child_process");
const dotenv = require('dotenv');
const http = require('http');
const fs = require('fs');
const test = require('../');

console.log(test);

dotenv.config({ path: './.env' });

const path = './backend/main.js';
const server = spawn('node', [path]);

server.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
});

server.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
});

server.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString());
});

http.createServer(function (req, res) {
    if (req.url === '/') {
        fs.readFile('./frontend/frontend/index.html', function (err,data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write(data.toString());
            res.end();
        });
    } else {
        fs.readFile('./frontend' + req.url, function (err,data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    }
}).listen(process.env.NEST_GII_FRONTEND_PORT);
