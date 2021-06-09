var fs = require('fs');
var Scriptdb = require('script.db');

var a = require('../api');
var api = new a();

const mc = require("minecraft-protocol");
const log = require('../log');

module.exports = (bot, client, window) => {
	var a,b,c,d;
	clearInterval(a);
    clearInterval(b);
	clearInterval(c);
	clearInterval(d);

    a = setInterval(() => {
        log("Run set topic");

        var get = new Scriptdb(`./data.json`).get('tab-content');
        if(get == undefined) return;
        
        var datas = get.toString().split("| ")[0];

        client.channels.cache.get(bot.defaultChannel).setTopic(
            datas + " - Đã vào server từ " + api.calcTime() + " trước."
            ).then(() => {
                log("Update topic")
            });

        setTimeout(() => {
            var guild = client.guilds.cache.map(guild => guild.id);
            setInterval(() => {
                if (guild[0]) {
                    const line = guild.pop()
                    const data = new Scriptdb(`./data/guilds/setup-${line}.json`);
                    const checkdata = data.get('livechat');

                    if(guild == undefined || checkdata == undefined) return;
                    
                    try {
                        if(bot.dev) return;
                        client.channels.cache.get(checkdata).setTopic(datas + " - Đã vào server từ " + api.calcTime() + " trước.")
                    } catch(e) {}
                }
            }, 200);
        }, 300);
    }, 5 * 60 * 1000);

    b = setInterval(() => {
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

                data.set('status', status + " | " + Date.now());
                data.set('queue', queue + " | " + Date.now());
                data.set('prio', prio + " | " + Date.now());

                log("Set queue status");
            }
        });
    }, 1 * 60 * 1000);

     c = setInterval(() => {
        if(bot.lobby) return;

        log("Anti-AFK")
        
        bot.swingArm("left");
        bot.look(Math.floor(Math.random() * Math.floor("360")), 0, true, null);
    }, 1 * 60 * 1000);

    setInterval(() => {
        log("Bot was send a message");

        fs.readFile("ads.txt", 'utf8', function (err, data) {
            if (err) throw err;
            const lines = data.split('\n');
            var random = lines[Math.floor(Math.random() * lines.length)];

            bot.chat(random);
        });
    },  10 * 60 * 1000);

    d = setInterval(() => {
        log("Save playerlist");

        if(bot.lobby) return;
        var Scriptdb = require('script.db');
        const data = new Scriptdb(`./data.json`);

        var list = Object.values(bot.players).map(p => p.username);

        data.set('players', list)
    },  1 * 60 * 1000);
}