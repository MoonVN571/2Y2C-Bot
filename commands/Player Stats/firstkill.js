const Scriptdb = require('script.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "firstkill",
    description: "Xem lần tin nhắn đầu giết người",
    delay: 5,

    async execute(client, message, args) {
        if (!args[0]) return message.provideUser();

        let quote = new Scriptdb(`./data/kills/${args[0]}.json`)
        let msgs = quote.get('deaths')
        let times = quote.get('times')

		if (!times || !msgs) return message.userNotFound();

        var data = msgs.split(" | ")[msgs.split(" | ").length - 1];
        var time;

        try {
            data = msgs.split(" | ")[msgs.split(" | ").length - 1];
        } catch (e) {
            data = msgs;
        }

        try {
            time = times.split(" | ")[times.split(" | ").length - 1]
        } catch (e) {
            time = times;
        }

        let timed = time ? api.ageCalc(time) : "Không rõ";

        var embed = new MessageEmbed()
            .setDescription("**" + timed + " trước**: " + data)
            .setColor(0x2EA711)

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}