const start = require('../index.js');

var Discord = require('discord.js');
var Scriptdb = require('script.db');
var waitUntil = require('wait-until');

var a = require("../api");
var api = new a();

module.exports = (bot, client) => {
    client.user.setActivity("");

    console.log('      Bot Ended');
	console.log('------------------------');

    bot.totalSeconds = 0;

    setTimeout(() => {
        var log = new Discord.MessageEmbed()
                        .setDescription("Bot đã mất kết nối đến server. Kết nối lại sau 1 phút." + `\nĐã hoạt động từ ${api.uptimeCalc()} trước.`)
                        .setColor("F71319");

        var notf = new Discord.MessageEmbed()
                                .setDescription("🏮 Bot đã mất kết nối đến server. 🏮")
                                .setColor("F71319");
        
                                
        if(bot.joined) {
            setTimeout(() => {
                client.channels.cache.get(bot.defaultChannel).send(notf);
            
                if(!bot.dev) {
                    setTimeout(() => {
                        var guild = client.guilds.cache.map(guild => guild.id);
                            setInterval(() => {
                                if (guild[0]) {
                                    const line = guild.pop()
                                    const data = new Scriptdb(`./data/guilds/setup-${line}.json`);
                                    const checkdata = data.get('livechat');

                                    if(checkdata == undefined || guild == undefined) return;

                                    try {
                                        client.channels.cache.get(checkdata).send(notf);
                                    } catch(e) {}
                                }
                            }, 200);
                    }, 1*100);
                }
                bot.joined = false;
            }, 3*1000);

            if(bot.dev) {
                client.channels.cache.get("807045720699830273").send(log);
            } else {
                client.channels.cache.get("806881615623880704").send(log);
            }
        }
        
        const uptime = new Scriptdb(`./data.json`);
        uptime.delete('tab-content');
        uptime.delete('uptime');


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