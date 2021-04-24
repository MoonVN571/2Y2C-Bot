var newAPI = require('../api.js');
var api = new newAPI();

var Discord = require('discord.js');
var Scriptdb = require("script.db");

module.exports = {
    name: "status",
    description: "status command.",
    aliases: ['uptime', 'tps', 'q', 'queue', 'que', 'prio', 'prioqueue', 'normalqueue'],

    async execute(client, message, args) {
        var dataa = new Scriptdb(`./data.json`).get('tab-content').toString();
		var uptime = dataa.split(' - ')[3].split(" | ")[0].split("restart từ")[1].split("trước")[0];
		var tps = dataa.split(' ')[1];
		var players = dataa.split(' ')[4];
		var ping = dataa.split(" - ")[2].split(" ping")[0];
		var timepassed  = dataa.split(" | ")[1];

        var user = client.users.cache.find(user => user.id === "425599739837284362")
        if(tps == "tps" || tps == " tps" || tps == "ping" || tps == " ping" || tps == "players" || tps == " players")
         
                    return message.channel.send(`Lỗi, thử lại sau! Hãy báo cáo lỗi này với **${user.username}#${user.discriminator}`)

		var embed = new Discord.MessageEmbed()
                .setAuthor('2Y2C VIETNAM','https://cdn.discordapp.com/attachments/795842485133246514/821669964673974282/communityIcon_14otnpwidot51.png')
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
                        value: ping + "ms",
                        inline: true
                    },
                    {
                        name: 'Hàng chờ',
                        value: "Bình thường: " + api.getQueue() + " - Ưu tiên: " + api.getPrio(),
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