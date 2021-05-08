var Scriptdb = require('script.db');
var Discord = require('discord.js');

var abc = require("../api")
var api = new abc();

module.exports = {
    name: "playtime",
    description: "playtime command.",
    aliases: ['pt', 'playtime'],
    
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(client.userNotFound);

		let pt = new Scriptdb(`./data/playtime/${args[0]}.json`);
		let playtime = pt.get('time')
		        
        if (playtime === undefined) return message.channel.send(client.userNotFound);

        var string = api.playtimeCalc(playtime);

        var embed = new Discord.MessageEmbed()
                        .setDescription(`${args[0]}: ${string}`)
                        .setColor(0x2EA711);

        message.channel.send(embed);
    }
}