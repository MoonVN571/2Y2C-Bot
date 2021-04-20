var Discord = require('discord.js');

var abc = require("../api")
var api = new abc();

module.exports = {
    name: "serverstatus",
    description: "serverstatus command.",
    aliases: ['ss'],
    
    async execute(client, message, args) {
        const embed = new Discord.MessageEmbed()
                        .setColor(0x000DFF)
                        .setDescription(api.getStatus());

        message.channel.send(embed);
    }
}