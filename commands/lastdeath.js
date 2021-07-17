var { MessageEmbed } = require('discord.js');
var Scriptdb = require('script.db');

var a = require("../api")
var api = new a();

module.exports = {
    name: "lastdeath",
    aliases: ['ld'],
    
    async execute(client, message, args) {
		if (!args[0]) return message.channel.send(client.userNotFound)

		let quote = new Scriptdb(`./data/deaths/${args[0]}.json`)
		let msgs = quote.get('deaths')
		let times = quote.get('times')
		
		if (msgs === undefined || times == undefined) return message.channel.send(client.userNotFound);

		var data;
		var time;

        try {
            data = msgs.split(" | ")[0];
        } catch(e) {
            data = msgs;
        }

        try {
            time = times.split(" | ")[0];
        } catch(e) {
            time = times;
        }

        var embed = new MessageEmbed()
                            .setDescription("**" + api.ageCalc(time) + " trước**: " + data)
                            .setColor(0x2EA711)

        message.channel.send(embed);
    }
}