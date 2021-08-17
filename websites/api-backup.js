const express = require('express')

const app = express()

var Scriptdb = require('script.db');

const {readFileSync, readFile} = require('fs');

app.get('/status', function (req, res) {
    if(!req.get('host').startsWith("api")) return;
    var data = new Scriptdb('./data.json').get('tab-content');

    if(!data) return res.send([]);

    var uptime = data.split(' - ')[3].split("restart từ ")[1].split(" trước ")[0];
    var tps = data.split('  ')[1].split(' tps')[0];
    var players = data.split('  ')[1].split(' ')[3];
    var ping = data.split(" - ")[2].split(" ping")[0];

    var obj = [tps,players,ping,uptime]
    
    res.send(obj);
});

app.get('/queue', function (req, res) {
    if(!req.get('host').startsWith("api")) return;
    var data = new Scriptdb('./data.json').get('queue');

    if(!data) return res.send([]);


    var obj = [data];
    
    res.send(obj);
});


app.get('/prio', function (req, res) {
    if(!req.get('host').startsWith("api")) return;
    var data = new Scriptdb('./data.json').get('prio');

    if(!data) return res.send([]);


    var obj = [data];
    
    res.send(obj);
});

app.get('/', function (req, res) {
    // var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    if(!req.get('host').startsWith("mo0nbot") || !req.get('host').startsWith("www")) return;

    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(readFileSync('./index.html'));
});

app.get('/', function (req, res) {
    if(!req.get('host').startsWith("image")) return;

    readFile('./image.png', (err, data) => {
        if(err) return;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<html><body><img src="data:image/png;base64,')
        res.write(Buffer.from(data).toString('base64'));
        res.end('"/></body></html>');
    });
});


app.get('/', function (req, res) {
    if(!req.get('host').startsWith("discord")) return;

    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(readFileSync('./server.html'));
});

app.get('/', function (req, res) {
    if(!req.get('host').startsWith("invite")) return;

    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(readFileSync('./invite.html'));
});

app.get('/data/2y2c/joindate', function(req, res) {
    if(!req.get('host').startsWith("api")) return;

    var username = req.url.split("=")[1];

    data = new Scriptdb('./data/joindate/' + username + '.json').get('date')

    if(!data) return res.send([]);

    res.json([{"datetime": data }])
});

app.get('/data/2y2c/playtime', function(req, res) {
    if(!req.get('host').startsWith("api")) return;

    var username = req.url.split("=")[1];

    data = new Scriptdb('./data/playtime/' + username + '.json').get('time')

    if(!data) return res.send([]);

    res.json([{"playtime": data}])
});

app.get('/data/2y2c/stats', function(req, res) {
    if(!req.get('host').startsWith("api")) return;

    var username = req.url.split("=")[1];

    data = new Scriptdb('./data/kd/' + username + '.json').get('kills')
    data2 = new Scriptdb('./data/kd/' + username + '.json').get('deaths')

    if(data == undefined) data = 0;
    if(data2 == undefined) data2 = 0;

    if(data == undefined && data2 == undefined) return res.send([]);


    res.json([{"kills": data, "deaths": data2}])
});

app.get('/data/2y2c/seen', function(req, res) {
    if(!req.get('host').startsWith("api")) return;

    var username = req.url.split("=")[1];

    data = new Scriptdb('./data/seen/' + username + '.json').get('seen')

    if(!data) return res.send([]);

    res.json([{"seen": data}])
});
app.listen(80)