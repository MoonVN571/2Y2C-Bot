var { readFile } = require('fs');
var Scriptdb = require('script.db');

var a = require('./api');
var api = new a();

const mc = require("minecraft-protocol");
const log = require('./log');

var e = require('./gotEvent');
var event = new e();

module.exports.start = (bot, client) => {
    var topic;
    var player;
    var data;
    var msg;
    var afk;

    if(event.getME()) {
        clearInterval(topic)
        clearInterval(player)
        clearInterval(data)
        clearInterval(msg)
        clearInterval(afk)
        event.setME(false);
    }

    topic = setInterval(() => {
        if(bot.lobby) return;
        log("Interval: Topic");

        var datas = new Scriptdb(`./data.json`).get('tab-content');
        if(datas == undefined) return;
        
        try {
            client.channels.cache.get(bot.defaultChannel).setTopic(datas.split(" | ")[0] + " - Đã vào server từ " + api.calcTime() + " trước.");

        } catch(e) { console.log(e)};
        
        client.guilds.cache.forEach((guild) => {
            const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
            const checkdata = data.get('livechat');

            if(checkdata == undefined || guild == undefined) return;
            
            try {
                if(bot.dev) return;
                client.channels.cache.get(checkdata).setTopic(datas.split(" | ")[0] + " - Đã vào server từ " + api.calcTime() + " trước.")
            } catch(e) {}
        }); 
    }, 5 * 60 * 1000);

    player = setInterval(() => {
        if(bot.lobby) return;
        log("Try to save palyerlist.");
        const data = new Scriptdb(`./data.json`);
        
        var list = Object.values(bot.players).map(p => p.username);
        data.set('players', list);
    }, 60 * 1000);

    afk = setInterval(() => {
        if(bot.lobby) return;
        bot.swingArm("left");
        bot.look(Math.floor(Math.random() * Math.floor("360")), 0, true, null);
        
        log("try to anti-afk.");
    }, 60 * 1000);

    data = setInterval(() => {
        log("Set server data.");
        
        mc.ping({ "host": "2y2c.org" }, (err, result) => {
            if (result) {
                try {
                    var players = [];
                    for (i = 0; result.players.sample.length > i; i++) {
                        players.push(result.players.sample[i].name);
                    }
                    var players2 = players.splice(0, Math.ceil(players.length / 2));
                    if (players == []) {
                        players.push(players2);
                        players2 = ".";
                    }
                } catch {
                    var players = 'Error';
                    var players2 = 'Error';
                }

                var old = players.toString().replace(",§6Cựu binh: §l0", "");
                var queue = old.toString().replace("§6Bình thường: §l", "");
                var prio = players2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");
                var status = "Hàng chờ: " + queue + " - Ưu tiên: " + prio + " - Trực tuyến: " + result.players.online;

                var Scriptdb = require('script.db');
                const data = new Scriptdb(`./data.json`);

                data.set('status', status);
                data.set('queue', queue);
                data.set('prio', prio);
            }
        });
    }, 1 * 60 * 1000);

    msg = setInterval(() => {
        readFile("ads.txt", 'utf8', function (err, data) {
            if (err) throw err;
            const lines = data.split('\n');
            var random = lines[Math.floor(Math.random() * lines.length)];

            if(random == "") return;

            bot.chat(random);
        });

        log("Send message");
    },  10 * 60 * 1000);
}