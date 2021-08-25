var { MessageEmbed } = require('discord.js');
var Scriptdb = require('script.db');

var a = require("../../api")
var api = new a();

module.exports = {
    name: "firstdeath",
    description: "Xem lần chết đầu tiên.",
    delay: 5,
    
    async execute(client, message, args) {
		if (!args[0]) return message.reply({embeds: [client.inputUsername]});

		let quote = new Scriptdb(`./data/kills/${args[0]}.json`)
		let msgs = quote.get('deaths')
		let times = quote.get('times')
		
		if (!msgs || !times) return message.reply({embeds: [client.userNotFound]});

		var data = msgs.split(" | ")[msgs.split(" | ").length - 1];
		var time;

        try {
            time = times.split(" | ")[times.split(" | ").length - 1]
        } catch(e) {
            time = times;
        }

        var embed = new MessageEmbed()
                            .setDescription("**" +api.ageCalc(time) + " trước**: " + data)
                            .setColor(0x2EA711)

        message.reply({embeds: [embed]});
    }
}