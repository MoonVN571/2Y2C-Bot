var Discord = require('discord.js');

var abc = require("../api")
var api = new abc();

module.exports = {
    name: "serverstatus",
    description: "serverstatus command.",
    aliases: ['ss', 'sstatus'],
    
    async execute(client, message, args) {
        var status = api.getStatus();
        if(status == null) return message.channel.send("Vui lòng thử lại.");

        const embed = new Discord.MessageEmbed()
                        .setColor(0x000DFF)
                        .setDescription(status);

        message.channel.send(embed);
    }
}