module.exports = {
    name: "joindate",
    description: "joindate command.",
    aliases: ['joindate', 'jd'],
    
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(client.userNotFound);

		let fj = new client.Scriptdb(`./data/joindate/${args}.json`);
		let firstjoin = fj.get('date');

		if (firstjoin === undefined) return message.channel.send(client.userNotFound);

        var embed = new client.Discord.MessageEmbed()
                        .setDescription(`Lần đầu thấy ${args[0]} vào ${firstjoin}`)
                        .setColor(0x2EA711);

        message.channel.send(embed);
    }
}