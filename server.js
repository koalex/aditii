'use strict';

const node_static   = require('node-static');
const fileServer    = new node_static.Server('./dist');

require('http').createServer((req, res) => {
    req.addListener('end', () => {
        fileServer.serve(req, res, (e, res) => {
            if (e && (e.status === 404)) {
                fileServer.serveFile('/not-found.html', 404, {}, req, res);
            }
        });
    }).resume();
}).listen(9000);