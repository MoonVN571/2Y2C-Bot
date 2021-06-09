var Scriptdb = require('script.db');
var { MessageEmbed } = require('discord.js');

const log = require('../log');

module.exports = (bot, client) => {
    bot.once('spawn', () => {
        log("Bot spawned in server")

        const uptime = new Scriptdb(`./data.json`);

        var d = new Date();
        uptime.set(`uptime`, d.getTime());

        const queuejoined = new MessageEmbed()
                            .setDescription(`Bot đang vào server..`)
                            .setColor(0x15ff00);


        const joinedd = new MessageEmbed()
                            .setDescription(`☘️ Đang vào server.. ☘️`)
                            .setColor(0x15ff00);

        
        bot.joined = true;
        
        if(bot.dev) {
            client.channels.cache.get(bot.defaultChannel).send(joinedd);
            client.channels.cache.get("807045720699830273").send(queuejoined); // bot log
        } else {
            client.channels.cache.get(bot.defaultChannel).send(joinedd);
            
            setTimeout(() => {
                var guild = client.guilds.cache.map(guild => guild.id);
                var i = setInterval(() => {
                    if (guild[0]) {
                        const line = guild.pop()
                        const data = new Scriptdb(`./data/guilds/setup-${line}.json`);
                        const checkdata = data.get('livechat');

                        if(checkdata == undefined || guild == undefined) return;

                        try {
                            client.channels.cache.get(checkdata).send(joinedd);
                        } catch(e) {}
                    } else
					clearInterval(i);
                }, 200);
            }, 100)

            client.channels.cache.get("806881615623880704").send(queuejoined); // devlog
        }
    })
}