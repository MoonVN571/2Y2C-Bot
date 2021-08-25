var Scriptdb = require('script.db');
var { MessageEmbed } = require('discord.js');

var a = require("../../api")
var api = new a();

module.exports = {
    name: "playtime",
    description: "Xem thời gian chơi.",
    aliases: ['pt', 'playtime'],
    delay: 5,
    
    async execute(client, message, args) {
		if (!args[0]) return message.reply({embeds: [client.inputUsername]});

		let pt = new Scriptdb(`./data/playtime/${args[0]}.json`);
		let playtime = pt.get('time')
		        
        if (playtime === undefined) return message.reply({embeds: [client.userNotFound]});

        var string = api.playtimeCalc(playtime);

        var embed = new MessageEmbed()
                        .setDescription(`${args[0]}: ${string}`)
                        .setColor(0x2EA711);

        message.reply({embeds: [embed]});
    }
}