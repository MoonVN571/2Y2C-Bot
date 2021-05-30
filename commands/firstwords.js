var { MessageEmbed } = require('discord.js');
var Scriptdb = require('script.db');

var a = require("../api")
var api = new a();

module.exports = {
    name: "firstwords",
    description: "firstwords command.",
    aliases: ['fw'],
    
    async execute(client, message, args) {
		if (!args[0]) return message.channel.send(client.userNotFound)

		let quote = new Scriptdb(`./data/quotes/${args[0]}.json`)
		let msgs = quote.get('messages')
		let times = quote.get('times')
		
		if (msgs === undefined || times == undefined) return message.channel.send(client.userNotFound);

		var data = msgs.split(" | ")[msgs.split(" | ").length - 1];
		var time;
        
        try {
            time = times.split(" | ")[msgs.split(" | ").length - 1];
        } catch(e) {
            time = times;
        }

        var embed = new MessageEmbed()
                            .setDescription("**" + api.ageCalc(time) + " trước**: <" + args[0] + "> " + data)
                            .setColor(0x2EA711)

        message.channel.send(embed);
    }
}