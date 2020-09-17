// to create the SSL cert and key:
// openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout newkey.key -out newkey.crt

const https = require('https');
const fs = require('fs');
const express = require('express');

const options = {
  key: fs.readFileSync('newkey.key'),
  cert: fs.readFileSync('newkey.crt')
};
const app = express();
app.use(express.static(__dirname));

https.createServer(options, app).listen(8080);
