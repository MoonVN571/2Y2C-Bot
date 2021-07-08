var { MessageEmbed } = require('discord.js');

module.exports = {
    name: "reload",
    aliases: ['rl'],
    
    async execute(client, message, args) {
        var noPerm = new MessageEmbed()
                    .setDescription('Bạn phải là nhà phát triển để sử dụng lệnh này.')
                    .setColor('0xC51515');

        if(message.author.id !== client.config.author)
            return message.channel.send(noPerm).then(msg => {
                msg.delete({ timeout: 10000 });
            });

        delete require.cache[require.resolve(`../commands/${args[0]}.js`)];

        try {
            const cmd = require(`../commands/${args[0]}`);
            client.commands.set(cmd.name, cmd);

            var successful = new MessageEmbed()
                    .setDescription(`Đã tải lại ${args[0]} thành công!`)
                    .setColor(0x2EA711);

            message.channel.send(successful);
        } catch(e) {
            message.channel.send({embed: {
                description: "Không tìm thấy lệnh này",
                color: 0xC51515
            }});
        }
    }
}