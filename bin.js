#!/usr/bin/env node
const { spawn } = require("child_process");
const dotenv = require('dotenv');
var http = require('http');
var fs = require('fs');

dotenv.config({ path: './.env' });

const path = process.cwd() + '/node_modules/vkoktashev-steroids-nest-gii/backend/main.js';
var server = spawn('node', [path]);

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
        fs.readFile(__dirname + '/frontend/frontend/index.html', function (err,data) {
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
        fs.readFile(__dirname + '/frontend' + req.url, function (err,data) {
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
