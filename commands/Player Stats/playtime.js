const Database = require('simplest.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "playtime",
    description: "Xem thời gian chơi.",
    aliases: ['pt', 'playtime'],
    delay: 5,

    async execute(client, message, args) {
        if (!args[0]) return message.provideUser();

        let pt = new Database({path:`./data/playtime/${args[0]}.json`});
        let playtime = pt.get('time')

        if (playtime === undefined) return message.userNotFound();

        var string = api.playtimeCalc(playtime);

        var embed = new MessageEmbed()
            .setDescription(`${args[0]}: ${string}`)
            .setColor(0x2EA711);

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}