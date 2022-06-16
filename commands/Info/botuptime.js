const { MessageEmbed } = require('discord.js');
const api = require('../../utils');
module.exports = {
    name: "botuptime",
    description: "Xem thời gian đã hoat4 động của bot.",
    aliases: ['bu'],
    delay: 5,

    execute(client, message, args) {
        console.log(process.uptime())
        let format = api.calc(parseInt(process.uptime()));

        message.reply({ embeds: [{
            description: "**" + format + "**",
            color: "BLUE"
        }], allowedMentions: { repliedUser: false } });
    }
}