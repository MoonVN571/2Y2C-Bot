var Discord = require('discord.js');

var Scriptdb = require('script.db');

module.exports = {
    name: "serverstatus",
    description: "Xem trạng thái của server (queue, prio, online)",
    aliases: ['ss', 'sstatus'],
    delay: 5,
    
    async execute(client, message, args) {
        const data = new Scriptdb(`./data.json`);

        var status = data.get('status');

        if(status == undefined) return message.reply("Không tìm thấy dữ liệu.")

        const embed = new Discord.MessageEmbed()
                        .setColor(0x000DFF)
                        .setDescription(status);

        message.reply({embeds: [embed]});
    }
}