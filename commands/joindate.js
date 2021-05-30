var Scriptdb = require('script.db');
var { MessageEmbed } = require('discord.js');

module.exports = {
    name: "joindate",
    aliases: ['joindate', 'jd'],
    
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(client.userNotFound);

		let fj = new Scriptdb(`./data/joindate/${args}.json`);
		let firstjoin = fj.get('date');

		if (firstjoin === undefined) return message.channel.send(client.userNotFound);

        var embed = new MessageEmbed()
                        .setDescription(`${args[0]}: ${firstjoin}`)
                        .setColor(0x2EA711);

        message.channel.send(embed);
    }
}