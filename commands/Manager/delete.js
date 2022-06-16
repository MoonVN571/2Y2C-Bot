const { Client, Message } = require("discord.js");
const Database = require('simplest.db');
module.exports = {
    name: "delete",
    description: "Xoá setup livechat",
    aliases: ['del'],
    admin: true,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    async execute(client, message, args) {
        if (!args[0]) return message.reply({ embeds: [{
            description: "Hãy cung cấp setting hợp lệ: **livechat/connection/restart/restart-role**\nVí dụ: " + client.PREFIX + "delete livechat",
            color: "GREEN"
        }], allowedMentions: { repliedUser: false } });
        
        switch (args[0]) {
            case "livechat": {
                if (!args[1]) return message.reply({ embeds: [{
                    description: "Hãy cung cấp kênh để xoá livechat.\nCách sử dụng: " + client.PREFIX + "delete livechat <#kênh/id>",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });
 
                let input = message.mentions.channels.first() || args[2];
                if(message.mentions.channels.first()) input = message.mentions.channels.first().id;

                let channel = client.channels.cache.get(input);
                let db = new Database({path: './data/guilds/setup-' + message.guildId + '.json'});


                if (!db.get('livechat')) return message.reply({ embeds: [{
                    description: "Bạn chưa setup livechat cho server này.",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                if (db.get('livechat') !== channel.id) return message.reply({ embeds: [{
                    description: "Bạn cung cấp kênh không hợp lệ!",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                message.reply({ embeds:[{
                    description: "Bạn đã xoá livechat tại kênh **<#" + channel + ">** thành công!",
                    color: "GREEN"
                }], allowedMentions: { repliedUser: false } }).then(() => {
                    db.delete('livechat');
                });
            }
                break;

            case "connection": {
                if (!args[1]) return message.reply({ embeds: [{
                    description: "Hãy xác nhận xoá kênh connection bàng cách gõ " + client.PREFIX + "delete connection <Kí tự bất kì>",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                let db = new Database({path: './data/guilds/setup-' + message.guildId + '.json'});

                if (!db.get('connection')) return message.reply({ embeds: [{
                    description: "Bạn chưa setup connection cho server này.",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                message.reply({ embeds:[{
                    description: "Bạn đã xoá connection tại kênh **<#" + db.get('connection') + ">** thành công!",
                    color: "GREEN"
                }], allowedMentions: { repliedUser: false } }).then(() => {
                    db.delete('connection');
                });
            }
                break;

            case "restart": {
                if (!args[1]) return message.reply({ embeds: [{
                    description: "Hãy xác nhận xoá kênh restart bàng cách gõ " + client.PREFIX + "delete restart <Kí tự bất kì>",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                let db = new Database({path: './data/guilds/setup-' + message.guildId + '.json'});

                if (!db.get('restartChannel')) return message.reply({ embeds: [{
                    description: "Bạn chưa setup kênh thông báo restart cho server này.",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                message.reply({ embeds:[{
                    description: "Bạn đã xoá thông báo restart tại kênh **<#" + db.get('restartChannel') + ">** thành công!",
                    color: "GREEN"
                }], allowedMentions: { repliedUser: false } }).then(() => {
                    db.delete('restartChannel');
                });
            }
                break;

            case "restart-role": {
                if (!args[1]) return message.reply({ embeds: [{
                    description: "Hãy xác nhận xoá role thông báo restart bàng cách gõ " + client.PREFIX + "delete restart-role <Kí tự bất kì>",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                let db = new Database({path: './data/guilds/setup-' + message.guildId + '.json'});

                if (!db.get('restartrole')) return message.reply({ embeds: [{
                    description: "Bạn chưa setup role thông báo restart cho server này.",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                message.reply({ embeds:[{
                    description: "Bạn đã xoá restart role thành công!",
                    color: "GREEN"
                }], allowedMentions: { repliedUser: false } }).then(() => {
                    db.delete('restartRole');
                });
            }

            default: {
                message.reply({ embeds: [{
                    description: "Hãy cung cấp setting hợp lệ: **livechat/connection/restart/restart-role**\nVí dụ: " + client.PREFIX + "delete livechat",
                    color: "GREEN"
                }], allowedMentions: { repliedUser: false } });
            }
        }
    }
}