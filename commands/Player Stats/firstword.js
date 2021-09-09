const Scriptdb = require('script.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "firstword",
    description: "Xem tin nhắn đã gửi đầu tiên",
    delay: 5,

    async execute(client, message, args) {
        if (!args[0]) return message.provideUser();

        let quote = new Scriptdb(`./data/quotes/${args[0]}.json`)
        let msgs = quote.get('messages')
        let times = quote.get('times')

        if (!msgs || !times) return message.userNotFound();

        var data;
        var time;

        try {
            data = msgs.split(" | ")[msgs.split(" | ").length - 1];
        } catch (e) {
            data = msgs;
        }

        try {
            time = times.split(" | ")[0];
        } catch (e) {
            time = times;
        }

        var embed = new MessageEmbed()
            .setDescription("**" + args[0] + "** [" + api.ageCalc(time) + " trước]: " + data)
            .setColor(0x2EA711)

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}