var { MessageEmbed } = require('discord.js');

var a = require ('../api');
var api = new a();

module.exports = {
    name: "botuptime",
    description: "bot uptime command.",
    aliases: ['bu'],
    
    async execute(client, message, args) {
        var format = api.calc(parseInt(process.uptime()));
        
        var embed = new MessageEmbed()
                        .setDescription("Uptime hiện tại: " + format)
                        .setColor(0x000DFF);
        
        message.channel.send(embed);
    }
}