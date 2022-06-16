const Scriptdb = require('script.db');
const { MessageEmbed } = require('discord.js');
const log = require('../log');
const { start } = require('../auto');
const { sendLivechat } = require('../functions');

module.exports = {
    name: 'spawn',
    once: true,
    execute(bot, client) {
        bot.joined = true;
        
        log("Bot spawned in server");
        start(bot, client);

        const queuejoined = new MessageEmbed()
            .setDescription(`Bot đang vào server..`)
            .setColor(0x15ff00);

        if(client.dev) client.channels.cache.get("807045720699830273").send({ embeds: [queuejoined] }); // bot log
        else client.channels.cache.get("806881615623880704").send({ embeds: [queuejoined] }); // main log


        const joinedd = new MessageEmbed()
            .setDescription(`☘️ Đang vào server.. ☘️`)
            .setColor(0x15ff00);

        sendLivechat({embeds: [joinedd]});
    }
}