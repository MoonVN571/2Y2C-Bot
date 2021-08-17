const start = require('../index');

var { MessageEmbed } = require('discord.js');
var Scriptdb = require('script.db');
var waitUntil = require('wait-until');

var a = require("../api");
var api = new a();

var e = require("../goTevent");
var event = new e();

const log = require('../log');


module.exports = {
	name: 'end',
	once: false,
	execute(bot, client) {
        client.user.setActivity("");
        
        console.log('      Bot Ended');
        console.log('------------------------');

        log("Bot ended");

        setTimeout(() => {
            if(bot.joined) {
                if(bot.lobby) {
                    var d = new Scriptdb('./data.json');
                    d.set('queueEnd', Date.now())
                }
                var disconnected = new MessageEmbed()
                                    .setDescription("🏮 Bot đã mất kết nối đến server. 🏮")
                                    .setColor("F71319");

                client.channels.cache.get(bot.defaultChannel).send(disconnected);
            
                if(!bot.dev) {
                    client.guilds.cache.forEach((guild) => {
                        const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
                        const checkdata = data.get('livechat');

                        if(checkdata == undefined || guild == undefined) return;

                        try { client.channels.cache.get(checkdata).send(disconnected); } catch(e) {}
                    });
                }
                
                bot.joined = false;

                var disconnectedLog = new MessageEmbed()
                                        .setDescription("Bot đã mất kết nối đến server. Kết nối lại sau 2 phút." + `\nThời gian trong hàng chờ là ${api.queueTime()}. Thời gian trong server là ${api.uptimeCalc()}.`)
                                        .setColor("F71319");

                if(bot.dev) {
                    client.channels.cache.get("807045720699830273").send(disconnectedLog);
                } else {
                    client.channels.cache.get("806881615623880704").send(disconnectedLog);
                }

                event.setAuto(false);
                api.clean();
            }
        }, 2 * 1000);
    }
}