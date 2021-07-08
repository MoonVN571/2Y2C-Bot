var { MessageEmbed } = require('discord.js');


module.exports = {
	name: 'message',
	once: false,
	execute(client, message) {
        if(message.author.bot || !message.content.startsWith(client.prefixSet) || message.author == client.user || message.channel.type == "dm") return;

        const args = message.content.slice(client.prefixSet.length).split(/ +/);
        const cmdName = args.shift().toLowerCase();
    
        const cmd = client.commands.get(cmdName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

        if(!cmd) return;
        
        client.userNotFound = new MessageEmbed()
                        .setDescription('Không tìm thấy người chơi.')
                        .setColor('0xC51515');
        
        client.footer = config.footer;
        client.color = config.botEmbedColor;
        client.prefix = config.prefix;
    
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