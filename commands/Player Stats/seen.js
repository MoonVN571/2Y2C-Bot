const Scriptdb = require('script.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "seen",
    description: "Xem lần cuối bot nhìn thấy người chơi.",
    aliases: ['seen'],
    delay: 5,

    async execute(client, message, args) {
        if (!args[0]) return message.provideUser();

        let ls = new Scriptdb(`./data/seen/${args[0]}.json`);
        let seen = ls.get('seen')

        if (!seen) return message.userNotFound();

        var age = api.ageCalc(seen);
        var embed = new MessageEmbed()
            .setDescription(`Bot đã nhìn thấy **${args[0]}** từ ${age} trước.`)
            .setColor(0x2EA711);

        message.reply({ embeds: [embed] });
    }
}