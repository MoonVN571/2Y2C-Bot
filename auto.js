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
    var afk;

    if(!event.getAuto()) {
        clearInterval(topic)
        clearInterval(player)
        clearInterval(data)
        clearInterval(afk)
        event.setAuto(true);
    }

    topic = setInterval(() => {
        if(bot.lobby) return;
        log("Interval: Topic");

        var datas = new Scriptdb(`./data.json`).get('tab-content');
        if(datas == undefined) return;
        
        client.channels.cache.get(bot.defaultChannel).setTopic(datas.split(" | ")[0] + " - Đã vào server từ " + api.calcTime() + " trước.");

        client.guilds.cache.forEach((guild) => {
            const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
            const checkdata = data.get('livechat');

            if(guild == undefined) return;
            
            let channel = client.channels.cache.get(checkdata);

            if(!channel) return;
            channel.setTopic(datas.split(" | ")[0] + " - Đã vào server từ " + api.calcTime() + " trước.").catch(err => {});
        });
    }, 6 * 60 * 1000);

    player = setInterval(() => {
        if(bot.lobby) return;
        log("Try to save palyerlist.");
        const data = new Scriptdb(`./data.json`, {
            asyncWrite: true,
            syncOnWrite: true
        });
        
        var list = Object.values(bot.players).map(p => p.username);
        data.set('players', list);
    }, 10 * 60 * 1000);

    afk = setInterval(() => {
        if(bot.lobby) return;
        if(bot.dev) {
            bot.chat(Math.floor(Math.random() * 10000000000));
        }
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
                    var players = '-1';
                    var players2 = '-1';
                }

                var old = players.toString().replace(",§6Cựu binh: §l0", "");
                var queue = old.toString().replace("§6Bình thường: §l", "");
                var prio = players2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");
                var status = "Hàng chờ: " + queue + " - Ưu tiên: " + prio + " - Trực tuyến: " + result.players.online;

                var Scriptdb = require('script.db');
                const data = new Scriptdb(`./data.json`);

                data.set('status', status + " " + Date.now());
                data.set('queue', queue + " " + Date.now());
                data.set('prio', prio + " " + Date.now());
            }
        });
    }, 5 * 60 * 1000);
}