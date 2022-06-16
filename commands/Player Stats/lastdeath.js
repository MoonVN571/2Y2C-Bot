const Database = require('simplest.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "lastdeath",
    description: "Xem tin nhắn đã chết mới nhất",
    delay: 5,

    async execute(client, message, args) {
        if (!args[0]) return message.provideUser();


        let data = new Database({path:`./data/deaths/${args[0]}.json`});
        let msgs = data.get('deaths');
        let times = data.get('times');

		if (!times || !msgs) return message.userNotFound();

        var embed = new MessageEmbed()
            .setDescription("**" + api.ageCalc(times.split(" | ")[0]) + " trước**: " + msgs.split(" | ")[0])
            .setColor(0x2EA711)

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}