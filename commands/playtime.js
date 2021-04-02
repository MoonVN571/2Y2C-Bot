module.exports = {
    name: "playtime",
    description: "playtime command.",
    aliases: ['pt', 'playtime'],
    
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(client.userNotFound);

		let pt = new Scriptdb(`./data/playtime/${args[0]}.json`);
		let playtime = pt.get('time')
		
        if (playtime === undefined) return message.channel.send(userNotFound);

        var string = client.api.playtimeCalc(playtime);

        var embed = new client.Discord.MessageEmbed()
                        .setDescription(`${args[0]}: ${string}`)
                        .setColor(0x2EA711);

        message.channel.send(embed);
    }
}