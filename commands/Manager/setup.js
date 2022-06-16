const { Client, Message, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const Database = require('simplest.db');
module.exports = {
    name: "setup",
    description: "Cài đặt livechat cho discord",
    admin: true,
    vote: true,
    delay: 5,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    async execute(client, message, args) {
        if (!args[0]) return message.reply({ embeds: [{
            description: "Hãy cung cấp setting hợp lệ: **livechat/connection/restart/restart-role**\nVí dụ: " + client.PREFIX + "setup livechat",
            color: "GREEN"
        }], allowedMentions: { repliedUser: false } });

        function sendAfter() {
            message.channel.send({ embeds: [{
                description: "Tham gia discord bot bên dưới để xem thông tin và 1 số hỏi đáp...",
                color: "AQUA"
            }], components: [new MessageActionRow().addComponents(new MessageButton().setStyle('LINK').setURL('https://discord.gg/rngBE96u').setLabel("Discord Server"))],
            allowedMentions: { repliedUser: false } });
        }

        switch (args[0]) {
            case "livechat": {
                if (!args[1]) return message.reply({ embeds: [{
                    description: "Hãy cung cấp kênh để đặt livechat.\nCách sử dụng: " + client.PREFIX + "setup livechat <#kênh/id>",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                let input = message.mentions.channels.first() || args[2];
                if(message.mentions.channels.first()) input = message.mentions.channels.first().id;

                let channel = client.channels.cache.get(input);

                let db = new Database({path: './data/guilds/setup-' + message.guildId + '.json'});
                

                if(!channel || channel.id == db.get('connection') || channel.id == db.get('restartChannel')) return message.reply({ embeds: [{
                    description: "Hãy cung cấp kênh hợp lệ để đặt livechat.",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });
                
                if (db.get('livechat')) return message.reply({ embeds: [{
                    description: "Bạn đã setup livechat, xoá livechat bằng lệnh: " + client.PREFIX + "delete livechat <#kênh/id>",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                if (!message.guild.me.permissionsIn(message.guild.channels.cache.get(channel.id)).has(Permissions.FLAGS.SEND_MESSAGES))
                    return message.reply({ embeds: [{
                    description: "Bot không thể gửi tin nhắn vào kênh này, hãy thử kênh khác...",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                message.reply({ embeds:[{
                    description: "Bạn đã setup livechat tại kênh **<#" + channel + ">** thành công!",
                    color: "GREEN"
                }], allowedMentions: { repliedUser: false } }).then(() => {
                    db.set('livechat', channel.id);
                });

                sendAfter();
            }
                break;

            case "connection": {
                if (!args[1]) return message.reply({ embeds: [{
                    description: "Hãy cung cấp kênh để đặt connection.\nCách sử dụng: " + client.PREFIX + "setup connection <#kênh/id>",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                let input = message.mentions.channels.first() || args[2];
                if(message.mentions.channels.first()) input = message.mentions.channels.first().id;

                let channel = client.channels.cache.get(input);

                let db = new Database({path: './data/guilds/setup-' + message.guildId + '.json'});

                if(!channel || channel == db.get('livechat') || channel == db.get('restartChannel')) return message.reply({ embeds: [{
                    description: "Hãy cung cấp kênh hợp lệ để đặt connection.",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                if (db.get('connection')) return message.reply({ embeds: [{
                    description: "Bạn đã setup connection, xoá connection bằng lệnh: " + client.PREFIX + "delete connection <#kênh/id>",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                if (!message.guild.me.permissionsIn(message.guild.channels.cache.get(channel.id)).has(Permissions.FLAGS.SEND_MESSAGES))
                    return message.reply({ embeds: [{
                    description: "Bot không thể gửi tin nhắn vào kênh này, hãy thử kênh khác...",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                message.reply({ embeds:[{
                    description: "Bạn đã setup connection tại kênh **<#" + channel + ">** thành công!",
                    color: "GREEN"
                }], allowedMentions: { repliedUser: false } }).then(() => {
                    db.set('connection', channel.id);
                })

                sendAfter();
            }
                break;

            case "restart-role": {
                if (!args[1]) return message.reply({ embeds: [{
                    description: "Hãy cung cấp **tên role** để đặt thông báo restart.\nCách sử dụng: " + client.PREFIX + "setup restart-role <tên role>",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                let role = message.guild.roles.cache.find(role => role.name == args.slice(2).join(" "));
                if (!role) return message.reply({ content: "Không tìm thấy tên role này.", allowedMentions: { repliedUser: false } });

                let db = new Database({path: './data/guilds/setup-' + message.guildId + '.json'});

                if (db.get('restartRole')) return message.reply({ embeds: [{
                    description: "Bạn đã setup restart role, xoá role bằng lệnh: " + client.PREFIX + "delete restart-role <tên role>",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                message.reply({ embeds:[{
                    description: "Bạn đã setup restart role tên **" + role.toString() + "** thành công!",
                    color: "GREEN"
                }], allowedMentions: { repliedUser: false } }).then(() => {
                    db.set('restartRole', role.id);
                });
            }
                break;

            case "restart": {
                if (!args[1]) return message.reply({ embeds: [{
                    description: "Hãy cung cấp kênh để đặt thông báo restart.\nCách sử dụng: " + client.PREFIX + "setup restart <#kênh/id>",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });
                
                let input = message.mentions.channels.first() || args[2];
                if(message.mentions.channels.first()) input = message.mentions.channels.first().id;

                let channel = client.channels.cache.get(input);

                let db = new Database({path: './data/guilds/setup-' + message.guildId + '.json'});

                if (db.get('restartChannel')) return message.reply({ embeds: [{
                    description: "Bạn đã setup kênh restart, xoá kênh bằng lệnh: " + client.PREFIX + "delete restart <#kênh/id>",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                if(!channel || channel.id == db.get('livechat') || channel.id == db.get('connection')) return message.reply({ embeds: [{
                    description: "Hãy cung cấp kênh hợp lệ để đặt kênh thông báo restart.",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                if (!message.guild.me.permissionsIn(channel).has(Permissions.FLAGS.SEND_MESSAGES))
                    return message.reply({ embeds: [{
                    description: "Bot không thể gửi tin nhắn vào kênh này, hãy thử kênh khác...",
                    color: "DARK_RED"
                }], allowedMentions: { repliedUser: false } });

                message.reply({ embeds:[{
                    description: "Bạn đã setup kênh thông báo restart tại **<#" + channel + ">** thành công!",
                    color: "GREEN"
                }], allowedMentions: { repliedUser: false } }).then(() => {
                    db.set('restartChannel', channel.id);
                });

                sendAfter();
            }
                break;

            default: {
                message.reply({ embeds: [{
                    description: "Hãy cung cấp setting hợp lệ: **livechat/connection/restart/restart-role**\nVí dụ: " + client.PREFIX + "setup livechat",
                    color: "GREEN"
                }], allowedMentions: { repliedUser: false } });
            }
        }
    }
}