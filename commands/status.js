var newAPI = require('../api.js');
var api = new newAPI();

var Discord = require('discord.js');
var Scriptdb = require("script.db");

module.exports = {
    name: "status",
    description: "status command.",
    aliases: ['uptime', 'tps', 'q', 'queue', 'que', 'prio', 'prioqueue', 'normalqueue'],

    async execute(client, message, args) {
        var data = new Scriptdb("./data.json");

        var queue = data.get('queue');
        var prio = data.get('prio');

        var tab = data.get('tab-content');
        if(tab == undefined) return message.channel.send("Bot chưa kết nối đến server hoặc server không hoạt động.");

		var uptime = tab.split(' - ')[3].split(" | ")[0].split("restart từ")[1].split("trước")[0];
		var tps = tab.split(' ')[1];
		var players = tab.split(' ')[4];
		var ping = tab.split(" - ")[2].split(" ping")[0];
		var timepassed  = tab.split(" | ")[1];

        var user = client.users.cache.find(user => user.id === "425599739837284362");

        if(tps == "tps" || ping == "ping"|| players == "players")
                    return message.channel.send(`Lỗi, thử lại sau! Hãy báo cáo lỗi này với **${user.username}#${user.discriminator}`)

        if(queue == undefined || prio == undefined) return message.channel.send("Không tìm thấy dữ liệu.");
        
		var embed = new Discord.MessageEmbed()
                .setAuthor('2Y2C','https://cdn.discordapp.com/attachments/795842485133246514/821669964673974282/communityIcon_14otnpwidot51.png')
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
                        value: "Bình thường: " + queue.split(" | ")[0] + " - Ưu tiên: " + prio.split(" | ")[0],
                        inline: true
                    }
                    )
                    // , 'https://cdn.discordapp.com/avatars/768448728125407242/aa2ce1d9374de6fc0dd28d349ca135af.webp?size=1024'
                .setFooter('Trạng thái server được cập nhật từ ' + api.ageCalc(timepassed) + " trước.")
                .setColor(0x000DFF)
                .setTimestamp();

		message.channel.send(embed);
    }
}