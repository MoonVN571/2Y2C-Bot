module.exports = {
    name: "reload",
    description: "reload command.",
    aliases: ['rl'],
    /*
    if(cmdName == "reload") {
        // if(username !== "MoonVN" || username !== "MoonZ" || username !== "MoonOnTop") return bot.whisper(username, "> Không thể sử dụng lệnh này.")
        if(!args[0]) return bot.whisper(username, "> Please type name of commands.")

        const cmd = require(`./ingame-commands/${args[0]}.js`);

        if(!cmd) return bot.whisper(username, "> Command not found.")
        client.commands.delete(args[0])
        client.commands.set(args[0], cmd);
        
        bot.whisper(username, "> reload success " + args[0])
        return;
    } */
    async execute(client, message, args) {
        var noPerm = new client.Discord.MessageEmbed()
                            .setDescription('Bạn không được phép sử dụng lệnh này.')
                            .setColor('0xC51515');

        if(!message.guild.member(message.author).hasPermission("ADMINISTRATORs"))
            return message.channel.send(noPerm).then(msg => {
                msg.delete({ timeout: 10000 });
            });

        var noData = new client.Discord.MessageEmbed()
                                .setDescription('Bạn cần cung cấp thông tin.')
                                .setColor('0xC51515'); 
        
        if (!args[0]) return message.channel.send(noData);

        const comd = require(`../commands/${args[0]}`)

        var noCmd = new client.Discord.MessageEmbed()
                                .setDescription('Không tìm thấy lệnh này.')
                                .setColor('0xC51515');

        if(!comd) return message.channel.send(noCmd); 

        client.commandss.delete(args[0])
        client.commandss.set(args[0], comd)

        var successful = new client.Discord.MessageEmbed()
                            .setDescription(`Đã tải lại command ${args[0]}.`)
                            .setColor(0x2EA711);

        message.channel.send(successful)
    }
}