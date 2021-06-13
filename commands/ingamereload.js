var { MessageEmbed } = require('discord.js');

module.exports = {
    name: "",
    aliases: [''],
    
    async execute(client, message, args) {
        
		var noPerm = new MessageEmbed()
                        .setDescription('Bạn phải là nhà phát triển để sử dụng lệnh này.')
                        .setColor('0xC51515');

        if(message.author.id !== config.author)
            return message.channel.send(noPerm).then(msg => {
                msg.delete({ timeout: 10000 });
            });

        delete require.cache[require.resolve(`../ingame-commands/${args[0]}.js`)];

        const cmd = require(`../ingame-commands/${args[0]}`);
        client.commands.set(cmd.name, cmd);


        var successful = new MessageEmbed()
                .setDescription(`Đã tải lại ${args[0]} thành công!`)
                .setColor(0x2EA711);

        message.channel.send(successful);
    }
}