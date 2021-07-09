var { MessageEmbed } = require('discord.js');


module.exports = {
	name: 'message',
	once: false,
	execute(client, message) {
        if(message.author.bot || !message.content.startsWith(client.prefix) || message.author == client.user || message.channel.type == "dm") return;

        const args = message.content.slice(client.prefix.length).split(/ +/);
        const cmdName = args.shift().toLowerCase();
    
        const cmd = client.commands.get(cmdName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

        if(!cmd) return;
        
        client.userNotFound = new MessageEmbed()
                        .setDescription('Không tìm thấy người chơi.')
                        .setColor('0xC51515');
    
        client.ping = client.ws.ping;
        
        try {
            cmd.execute(client, message, args);
        }catch(err) {
            console.log(cmdName);
            console.log(err);
            console.log(err.toString());
        }
    }
}