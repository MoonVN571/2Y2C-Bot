const express = require('express')

const app = express()

var Scriptdb = require('script.db');

const {readFileSync} = require('fs');

app.get('/api/status', function (req, res) {
    var data = new Scriptdb('./data.json').get('tab-content');

    if(!data) return res.send([]);

    var uptime = data.split(' - ')[3].split("restart từ ")[1].split(" trước ")[0];
    var tps = data.split('  ')[1].split(' tps')[0];
    var players = data.split('  ')[1].split(' ')[3];
    var ping = data.split(" - ")[2].split(" ping")[0];

    var obj = [tps,players,ping,uptime]
    
    res.send(obj);
});

app.get('/api/queue', function (req, res) {
    var data = new Scriptdb('./data.json').get('queue');

    if(!data) return res.send([]);


    var obj = [data];
    
    res.send(obj);
});


app.get('/api/prio', function (req, res) {
    var data = new Scriptdb('./data.json').get('prio');

    if(!data) return res.send([]);


    var obj = [data];
    
    res.send(obj);
});

app.get('/', function (req, res) {
    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(readFileSync('./index.html'));
});

app.get('/server', function (req, res) {
    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(readFileSync('server.html'));
});

app.get('/invite', function (req, res) {
    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(readFileSync('invite.html'));
});

app.get('/api', function(req, res) {
    res.send("Nhập data");
});

app.get('/api/2y2c/data/joindate', function(req, res) {
    var username = req.url.split("=")[1];

    data = new Scriptdb('./data/joindate/' + username + '.json').get('date')

    if(!data) return res.send([]);

    res.json([{"datetime": data }])
});

app.get('/api/2y2c/data/playtime', function(req, res) {
    var username = req.url.split("=")[1];

    data = new Scriptdb('./data/playtime/' + username + '.json').get('time')

    if(!data) return res.send([]);

    res.json([{"playtime": data}])
});

app.get('/api/2y2c/data/stats', function(req, res) {
    var username = req.url.split("=")[1];

    data = new Scriptdb('./data/kd/' + username + '.json').get('kills')
    data2 = new Scriptdb('./data/kd/' + username + '.json').get('deaths')

    if(data == undefined) data = 0;
    if(data2 == undefined) data2 = 0;

    if(data == undefined && data2 == undefined) return res.send([]);


    res.json([{"kills": data, "deaths": data2}])
});

app.get('/api/2y2c/data/seen', function(req, res) {
    var username = req.url.split("=")[1];

    data = new Scriptdb('./data/seen/' + username + '.json').get('seen')

    if(!data) return res.send([]);

    res.json([{"seen": data}])
});

app.listen(80)