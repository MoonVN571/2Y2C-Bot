const { MessageEmbed } = require('discord.js');
const api = require('../../utils');
module.exports = {
    name: "botuptime",
    description: "Xem thời gian đã hoat4 động của bot.",
    aliases: ['bu'],
    delay: 5,

    execute(client, message, args) {
        var format = api.calc(parseInt(process.uptime()));

        var embed = new MessageEmbed()
            .setDescription("Uptime hiện tại: " + format)
            .setColor(0x000DFF);

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}