const express = require('express');
const app = express();
var Scriptdb = require('script.db');
const Topgg = require('@top-gg/sdk');
const client = require('./index');

app.get('/status', function (req, res) {
    var data = new Scriptdb('./data.json').get('tab-content');

    if(!data) return res.send([]);

    var uptime = data.split(' - ')[3].split("restart từ ")[1].split(" trước ")[0];
    var tps = data.split('  ')[1].split(' tps')[0];
    var players = data.split('  ')[1].split(' ')[3];
    var ping = data.split(" - ")[2].split(" ping")[0];
    var updateat = data.split(" | ")[1];

    var obj = [tps,players,ping,uptime,+updateat]
    
    res.send(obj);
});

app.get('/queue', function (req, res) {
    var data = new Scriptdb('./data.json').get('queue');

    if(!data) return res.send([]);

    var obj = data.split(" ");
    
    res.send([+obj[0], +obj[1]]);
});
// res.send('<p>some html</p>');
// res.status(404).send('Sorry, cant find that');

app.get('/', (req, res) => {    
    res.send("<title>Moonbot API</title>\u300b Valid endpoint:<br>GET /status<br>GET /queue<br>GET /prio<br>GET /data/2y2c/joindate?username=mo0nbot<br>GET /data/2y2c/seen?username=mo0nbot<br>GET /data/2y2c/stats?username=mo0nbot<br>GET /data/2y2c/playtime?username=mo0nbot");
});

app.get('/prio', function (req, res) {
    var data = new Scriptdb('./data.json').get('prio');

    if(!data) return res.send([]);

    var obj = data.split(" ");
    
    res.send([+obj[0], +obj[1]]);
});

app.get('/data/2y2c/joindate', function(req, res) {
    var username = req.url.split("=")[1];

    data = new Scriptdb('./data/joindate/' + username + '.json').get('date')

    if(!data) return res.send([]);

    res.json([{"datetime": data }])
});

app.get('/data/2y2c/playtime', function(req, res) {
    var username = req.url.split("=")[1];

    data = new Scriptdb('./data/playtime/' + username + '.json').get('time')

    if(!data) return res.send([]);

    res.json([{"playtime": data}])
});

app.get('/data/2y2c/stats', function(req, res) {
    var username = req.url.split("=")[1];

    data = new Scriptdb('./data/kd/' + username + '.json').get('kills')
    data2 = new Scriptdb('./data/kd/' + username + '.json').get('deaths')

    if(data == undefined) data = 0;
    if(data2 == undefined) data2 = 0;

    if(data == undefined && data2 == undefined) return res.send([]);


    res.json([{"kills": data, "deaths": data2}])
});

app.get('/data/2y2c/seen', function(req, res) {
    var username = req.url.split("=")[1];

    data = new Scriptdb('./data/seen/' + username + '.json').get('seen')

    if(!data) return res.send([]);

    res.json([{"seen": data}])
});


const webhook = new Topgg.Webhook(client.config.TOPGG_AUTH)
app.post('/dblwebhook', webhook.listener(vote => {
    let data = new Scriptdb('./voted.json');
    
    data.set(vote.user, Date.now());
    
    client.users.fetch(vote.user).then(user => {
        client.channels.cache.get('862215076698128396').send({embeds: [{
            description: "**" + user.tag + "** đã vote bot!",
            color: client.config.DEF_COLOR
        }]});
    });
}));

app.listen(80);