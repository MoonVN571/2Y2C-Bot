const Database = require('simplest.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "lastword",
    description: "Xem tin nhắn đã gửi mới nhất",
    delay: 5,

    async execute(client, message, args) {
		if (!args[0]) return;

        let quote = new Database({path:`./data/quotes/${args[0]}.json`})
        let msgs = quote.get('messages')
        let times = quote.get('times')

        if (!msgs || !times) return message.userNotFound();

        var data;
        var time;

        try {
            data = msgs.split(" | ")[0];
        } catch (e) {
            data = msgs;
        }

        try {
            time = times.split(" | ")[times.split(" | ").length - 1];
        } catch (e) {
            time = times;
        }

        let timed = time ? api.ageCalc(time) : "Không rõ";

        var embed = new MessageEmbed()
            .setDescription("**" + args[0] + "** [" + timed + " trước]: " + data)
            .setColor(0x2EA711)

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}