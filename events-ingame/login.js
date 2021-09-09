const Scriptdb = require('script.db');
const { MessageEmbed } = require('discord.js');
const log = require('../log');
const { start } = require('../auto');

module.exports = {
    name: 'spawn',
    once: true,
    execute(bot, client) {
        log("Bot spawned in server");

        const queuejoined = new MessageEmbed()
            .setDescription(`Bot đang vào server..`)
            .setColor(0x15ff00);


        const joinedd = new MessageEmbed()
            .setDescription(`☘️ Đang vào server.. ☘️`)
            .setColor(0x15ff00);

        bot.joined = true;

        start(bot, client);

        if (bot.dev) {
            client.channels.cache.get(bot.defaultChannel).send({ embeds: [joinedd] });
            client.channels.cache.get("807045720699830273").send({ embeds: [queuejoined] }); // bot log
        } else {
            client.channels.cache.get(bot.defaultChannel).send({ embeds: [joinedd] });

            client.guilds.cache.forEach((guild) => {
                const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
                const checkdata = data.get('livechat');

                if (checkdata == undefined || guild == undefined) return;

                try { client.channels.cache.get(checkdata).send({ embeds: [joinedd] }); } catch (e) { }

            });

            try { client.channels.cache.get("806881615623880704").send({ embeds: [queuejoined] }); devlog } catch (e) { } // devlog
        }
    }
}