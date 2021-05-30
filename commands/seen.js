var { MessageEmbed } = require('discord.js');
var Scriptdb = require('script.db');

var abc = require("../api")
var api = new abc();

module.exports = {
    name: "seen",
    description: "seen command.",
    aliases: ['seen'],
    
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(client.userNotFound)

		let ls = new Scriptdb(`./data/seen/${args[0]}.json`);
		let seen = ls.get('seen')

		if (seen == undefined) return message.channel.send(client.userNotFound);
		
		var age = api.ageCalc(seen);
		var embed = new MessageEmbed()
                                .setDescription(`Bot đã nhìn thấy **${args[0]}** từ ${age} trước.`)
                                .setColor(0x2EA711);

		message.channel.send(embed);
    }
}