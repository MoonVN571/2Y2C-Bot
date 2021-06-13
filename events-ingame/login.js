var Scriptdb = require('script.db');
var { MessageEmbed } = require('discord.js');

const log = require('../log');

module.exports = (bot, client) => {
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
        
        client.guilds.cache.forEach((guild) => {
            const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
            const checkdata = data.get('livechat');

            if(checkdata == undefined || guild == undefined) return;
            
            try {
                client.channels.cache.get(checkdata).send(joinedd);
            } catch(e) {}
        });

        client.channels.cache.get("806881615623880704").send(queuejoined); // devlog
    }
}