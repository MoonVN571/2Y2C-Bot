const Database = require('simplest.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "firstword",
    description: "Xem tin nhắn đã gửi đầu tiên",
    delay: 5,

    async execute(client, message, args) {
        if (!args[0]) return message.provideUser();

        let data = new Database({path:`./data/quotes/${args[0]}.json`});
        let msgs = data.get('messages');
        let times = data.get('times');

        if (!msgs || !times) return message.userNotFound();

        var embed = new MessageEmbed()
            .setDescription("**" + args[0] + "** [" + api.ageCalc(times.split(" | ")[0]) + " trước]: " + msgs.split(" | ")[0])
            .setColor(0x2EA711)

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}