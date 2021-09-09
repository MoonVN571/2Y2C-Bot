const Scriptdb = require('script.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "serverstatus",
    description: "Xem trạng thái của server (queue, prio, online)",
    aliases: ['ss', 'sstatus'],
    delay: 5,

    async execute(client, message, args) {
        const data = new Scriptdb(`./data.json`);

        var status = data.get('status');
        if (!status) return message.reply("Không tìm thấy dữ liệu.")

        const embed = new MessageEmbed()
            .setColor(0x000DFF)
            .setDescription(status);

        message.reply({ embeds: [embed] });
    }
}