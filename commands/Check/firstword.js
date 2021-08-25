var { MessageEmbed } = require('discord.js');
var Scriptdb = require('script.db');

var a = require("../../api")
var api = new a();

module.exports = {
    name: "firstword",
    description: "Xem tin nhắn đã gửi đầu tiên",
    delay: 5,
    
    async execute(client, message, args) {
		if (!args[0]) return message.reply({embeds: [client.inputUsername]});

		let quote = new Scriptdb(`./data/quotes/${args[0]}.json`)
		let msgs = quote.get('messages')
		let times = quote.get('times')
		
		if (!msgs || !times) return message.reply({embeds: [client.userNotFound]});

		var data;
		var time;
        
        try {
            data = msgs.split(" | ")[msgs.split(" | ").length - 1];
        } catch(e) {
            data = mgs;
        }

        try {
            time = times.split(" | ")[0];
        } catch(e) {
            time = times;
        }

        var embed = new MessageEmbed()
                            .setDescription("**" + args[0] + "** [" + api.ageCalc(time) + " trước]: " + data)
                            .setColor(0x2EA711)

        message.reply({embeds: [embed]});
    }
}