const os = require("os");
const { MessageEmbed } = require('discord.js');
const api = require('../../utils');
module.exports = {
    name: "botinfo",
    description: "Xem thông tin của bot",
    aliases: ['bi'],
    delay: 5,

    execute(client, message, args) {
        message.reply({
            embeds: [{
                description: "Đang lấy thông tin của bot...",
                color: "BLUE"
            }], allowedMentions: { repliedUser: false }
        }).then(msg => {
            msg.edit({ embeds: [{
                title: "THÔNG SỐ BOT",
                fields: [
                    {
                        name: "Bot API Latency",
                        value: client.ws.ping + "ms",
                        inline: true 
                    },
                    {
                        name: "Bot Latency",
                        value: (msg.createdTimestamp - message.createdTimestamp) + "ms",
                        inline: true
                    },
                    {
                        name: "Bot Version",
                        value: require("../../package.json").version,
                        inline: true
                    },
                    {
                        name: "Nodejs",
                        value: process.version.toString(),
                        inline: true
                    },
                    {
                        name: "Mineflayer",
                        value: require("mineflayer/package.json").version,
                        inline: true
                    },
                    {
                        name: "Discord.js",
                        value: require("discord.js").version,
                        inline: true
                    },
                ],
                color: "BLUE"
            }], allowedMentions: { repliedUser: false } });
        })
    }
}