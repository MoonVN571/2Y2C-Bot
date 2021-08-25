var { MessageEmbed } = require('discord.js');
var Scriptdb = require('script.db');

var a = require("../../api")
var api = new a();

module.exports = {
    name: "lastword",
    description: "Xem tin nhắn đã gửi mới nhất",
    delay: 5,
    
    async execute(client, message, args) {
		if (!args[0]) return message.reply({embeds: [client.inputUsername]});

		let quote = new Scriptdb(`./data/quotes/${args[0]}.json`)
		let msgs = quote.get('messages')
		let times = quote.get('times')
		
		if (msgs === undefined || times == undefined) return message.reply({embeds: [client.userNotFound]});

		var data;
		var time;

        try {
            data = msgs.split(" | ")[0];
        } catch(e) {
            data = mgs;
        }

        try {
            time = times.split(" | ")[times.split(" | ").length - 1];
        } catch(e) {
            time = times;
        }

        let timed = time ? api.ageCalc(time) : "Không rõ";

        var embed = new MessageEmbed()
                            .setDescription("**" + args[0] + "** [" + timed + " trước]: " + data)
                            .setColor(0x2EA711)

        message.reply({embeds: [embed]});
    }
}