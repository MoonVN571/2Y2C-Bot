const start = require('../index.js');

var { MessageEmbed } = require('discord.js');
var Scriptdb = require('script.db');
var waitUntil = require('wait-until');

var a = require("../api");
var api = new a();

const log = require('../log');

module.exports = (bot, client) => {
    client.user.setActivity("");

    console.log('      Bot Ended');
	console.log('------------------------');

    bot.totalSeconds = 0;

    log("Bot ended");

    setTimeout(() => {
        if(bot.joined) {
            var disconnected = new MessageEmbed()
                                .setDescription("🏮 Bot đã mất kết nối đến server. 🏮")
                                .setColor("F71319");

            setTimeout(() => {
                client.channels.cache.get(bot.defaultChannel).send(disconnectedLog);
            
                if(!bot.dev) {
                    setTimeout(() => {
                        let guild = client.guilds.cache.map(guild => guild.id);
                        var i = setInterval(() => {
                            if (guild[0]) {
                                const line = guild.pop()
                                const data = new Scriptdb(`./data/guilds/setup-${line}.json`);
                                const checkdata = data.get('livechat');

                                if(checkdata == undefined || guild == undefined) return;

                                try {
                                    client.channels.cache.get(checkdata).send(disconnected);
                                } catch(e) {}
                            } else
                            clearInterval(i);
                        }, 200);
                    }, 1*100);
                }
                bot.joined = false;
            }, 3*1000);

            var disconnectedLog = new MessageEmbed()
                                    .setDescription("Bot đã mất kết nối đến server. Kết nối lại sau 1 phút." + `\nThời gian bot trong server: ${api.uptimeCalc()}.`)
                                    .setColor("F71319");

            if(bot.dev) {
                client.channels.cache.get("807045720699830273").send(disconnectedLog);
            } else {
                client.channels.cache.get("806881615623880704").send(disconnectedLog);
            }
        }
        
        const data = new Scriptdb(`./data.json`);

        data.set('queueStart', null);
        data.set('queueEnd', null);

        data.set('tab-content', null);
        data.set('uptime', null);
        data.set('players', null);
        
        waitUntil(60 * 1000, 50, function condition() {
            try {
                start.createBot();
                return true;
            } catch (error) {
                console.log("Error: " + error);
                return false;
            }
        }, function done(result) {
            console.log('Reconected to the server.');
        });
    }, 2 * 1000);
}