const Database = require('simplest.db');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "stats",
    description: "Xem chỉ số người chơi.",
    aliases: ['kd', 'stats'],
    delay: 5,

    async execute(client, message, args) {
        if (!args[0]) return message.provideUser();

        const kd = new Database({path:`./data/kd/${args[0]}.json`});
        let deads = kd.get('deaths');
        let kills = kd.get('kills');

        if (!kills && !deads) return message.userNotFound();

        if (!kills) kills = 0;
        if (!deads) deads = 0;

        var ratio = kills / deads;
        var ratioFixed = ratio.toFixed(2);

        if (ratioFixed === "NaN" || ratioFixed === "Infinity") {
            ratioFixed = "0.00";
        }

        var embed = new MessageEmbed()
            .setAuthor(`${args[0]}'s statistics`, `https://minotar.net/helm/${args[0]}`, `https://namemc.com/` + args[0])
            .addField(`Kills`, `${kills}`, true)
            .addField(`Deaths`, `${deads}`, true)
            .addField(`K/D`, `${ratioFixed}`, true)
            .setThumbnail(`https://minotar.net/helm/${args[0]}`)
            .setColor(0x2EA711)
            .setTimestamp();

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}