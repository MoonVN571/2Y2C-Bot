var Discord = require('discord.js');

var Scriptdb = require('script.db');
const data = new Scriptdb(`./data.json`);

module.exports = {
    name: "serverstatus",
    description: "serverstatus command.",
    aliases: ['ss', 'sstatus'],
    
    async execute(client, message, args) {
        var status = data.get('status');

        if(status == undefined) return message.channel.send("Không tìm thấy dữ liệu.")

        const embed = new Discord.MessageEmbed()
                        .setColor(0x000DFF)
                        .setDescription(status);

        message.channel.send(embed);
    }
}