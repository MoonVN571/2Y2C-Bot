var Scriptdb = require('script.db');
var Discord = require('discord.js');

module.exports = {
    name: "joindate",
    description: "joindate command.",
    aliases: ['joindate', 'jd'],
    
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(client.userNotFound);

		let fj = new Scriptdb(`./data/joindate/${args}.json`);
		let firstjoin = fj.get('date');

		if (firstjoin === undefined) return message.channel.send(client.userNotFound);

        var embed = new Discord.MessageEmbed()
                        .setDescription(`${args[0]}: ${firstjoin}`)
                        .setColor(0x2EA711);

        message.channel.send(embed);
    }
}