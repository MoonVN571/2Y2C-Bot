const Scriptdb = require('script.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "firstdeath",
    description: "Xem lần chết đầu tiên.",
    delay: 5,

    async execute(client, message, args) {
        if (!args[0]) return message.provideUser();

        let quote = new Scriptdb(`./data/kills/${args[0]}.json`)
        let msgs = quote.get('deaths')
        let times = quote.get('times')

		if (!times || !deaths) return message.userNotFound();

        var data = msgs.split(" | ")[msgs.split(" | ").length - 1];
        var time;

        try {
            time = times.split(" | ")[times.split(" | ").length - 1]
        } catch (e) {
            time = times;
        }

        var embed = new MessageEmbed()
            .setDescription("**" + api.ageCalc(time) + " trước**: " + data)
            .setColor(0x2EA711)

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}