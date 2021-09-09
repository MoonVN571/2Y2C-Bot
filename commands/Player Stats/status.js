const Scriptdb = require('script.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "status",
    description: "Xem thông tin server (tps, ping, players, queue, prio)",
    aliases: ['uptime', 'tps', 'q', 'queue', 'que', 'prio', 'prioqueue', 'normalqueue'],
    delay: 5,

    async execute(client, message, args) {
        var data = new Scriptdb("./data.json");

        var queue = data.get('queue');
        var prio = data.get('prio');

        var tab = data.get('tab-content');
        if (!tab) return message.reply("Bot chưa kết nối đến server.");

        var uptime = tab.split(' - ')[3].split("restart từ")[1].split("trước")[0];
        var tps = tab.split('  ')[1].split(' tps')[0];
        var players = tab.split('  ')[1].split(' ')[3];
        var ping = tab.split(" - ")[2].split(" ping")[0];
        var timepassed = tab.split(" | ")[1];


        if (tps == "tps" || ping == "ping" || players == "players")
            return message.reply(`Lỗi, thử lại sau!`);

        if (queue == undefined || prio == undefined) return message.reply("Không tìm thấy dữ liệu.");

        var embed = new MessageEmbed()
            .setAuthor('2Y2C', 'https://cdn.discordapp.com/attachments/795842485133246514/821669964673974282/communityIcon_14otnpwidot51.png')
            .addFields(
                {
                    name: 'Server Uptime',
                    value: uptime,
                    inline: true
                },
                {
                    name: 'Bot Uptime',
                    value: api.uptimeCalc(),
                    inline: true
                },
                {
                    name: 'TPS',
                    value: tps,
                    inline: true
                },
                {
                    name: 'Players',
                    value: players + " players",
                    inline: true
                },
                {
                    name: 'Bot Ping',
                    value: ping + " ms",
                    inline: true
                },
                {
                    name: 'Hàng chờ',
                    value: "Bình thường: " + queue.split(" ")[0] + " - Ưu tiên: " + prio.split(" ")[0],
                    inline: true
                }
            )
            .setFooter('Cập nhật ' + api.ageCalc(timepassed) + " trước.", 'https://cdn.discordapp.com/avatars/768448728125407242/f18ec971961b23db96e6cf0f3f79ec1c.png?size=256')
            .setColor(0x000DFF)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
}