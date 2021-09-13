const Database = require("simplest.db");
const { Client, Message, Permissions } = require('discord.js');

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
        if (!args[0]) return message.reply({ content: "Cách dùng: " + client.PREFIX + "setup <livechat/connection/restart/role>", allowedMentions: { repliedUser: false } });

        function sendAfter() {
            message.reply({ content: "Bạn nên tham gia discord dev để cập nhật tình hình của bot tại announcements.\ndiscord.gg/yrNvvkqp6w", allowedMentions: { repliedUser: false } });
        }

        switch (args[0]) {
            case "livechat": {
                if (!args[1]) return message.reply({ content: "Cách dùng: " + client.PREFIX + "setup livechat <#Kênh>", allowedMentions: { repliedUser: false } });

                var channel = message.content.replace(/\D/g, '');
                if (!channel) channel = args[2];

                const data = new Database({ path: `./data/guilds/setup-${message.guildId}.json` });

                if (!data.get('livechat')) return message.reply({ content: "Bạn đã setup kênh log livechat rồi. Xoá kênh log livechat bằng lệnh " + client.PREFIX + "delete livechat <Kênh>", allowedMentions: { repliedUser: false } })

                if (!message.guild.me.permissionsIn(channel).has(Permissions.FLAGS.SEND_MESSAGES))
                    return message.reply({ content: "Bot không có quyền gửi tin nhắn vào kênh này", allowedMentions: { repliedUser: false } });

                if (isNaN(channel) || !client.channels.cache.get(channel)) return message.reply({ content: "Kênh không hợp lệ!", allowedMentions: { repliedUser: false } });

                message.reply({ content: "Bạn đã setup chat tại kênh <#" + channel + "> thành công!", allowedMentions: { repliedUser: false } }).then(() => {
                    setTimeout(() => {
                        try {
                            client.channels.cache.get(channel).send("Cài đặt livechat thành công!").then(() => data.set('livechat', channel));
                        } catch (e) {
                            message.channel.send({ content: "Bot không có quyền gửi tin nhắn vào kênh này, tiến hành xoá kênh livechat.", allowedMentions: { repliedUser: false } });
                            data.delete('livechat', channel);
                        }
                    }, 60 * 1000);
                });

                sendAfter();
            }
                break;

            case "connection": {
                if (!args[1]) return message.reply({ content: "Cách dùng: " + client.PREFIX + "setup connection <#Kênh>", allowedMentions: { repliedUser: false } });

                var channel = message.content.replace(/\D/g, '');
                if (!channel) channel = args[2];

                const data = new Database({ path: `./data/guilds/setup-${message.guildId}.json` });

                if (data.get('connection')) return message.reply({ content: "Bạn đã kênh log connection rồi. Xoá kênh log connection bằng lệnh " + client.PREFIX + "delete livechat <#Kênh>", allowedMentions: { repliedUser: false } })

                if (data.get('livechat') == channel) return message.reply({ content: "Bạn không thể setup cùng kênh vì sẽ ảnh hưởng đến tốc độ log chat.", allowedMentions: { repliedUser: false } });

                if (isNaN(channel) || !client.channels.cache.get(channel)) return message.reply({ content: "Kênh không hợp lệ!", allowedMentions: { repliedUser: false } });

                if (!message.guild.me.permissionsIn(channel).has(Permissions.FLAGS.SEND_MESSAGES))
                    return message.reply({ content: "Bot không có quyền gửi tin nhắn vào kênh này", allowedMentions: { repliedUser: false } });

                message.reply({ content: "Bạn đã setup kênh log connection tại kênh <#" + channel + "> thành công!", allowedMentions: { repliedUser: false } }).then(() => {
                    setTimeout(() => {
                        try {
                            client.channels.cache.get(channel).send("Cài đặt kênh connection thành công!").then(() => data.set('connection', channel));
                        } catch (e) {
                            message.channel.send({ content: "Bot không có quyền gửi tin nhắn vào kênh này, tiến hành xoá kênh connection.", allowedMentions: { repliedUser: false } });
                            data.delete('connection', channel);
                        }
                    }, 60 * 1000);
                });

                sendAfter();
            }
                break;

            case "restart-role": {
                if (!args[1]) return message.reply({ content: "Cách dùng: " + client.PREFIX + "setup restart-role <Tên role>", allowedMentions: { repliedUser: false } });

                const data = new Database({ path: `./data/guilds/setup-${message.guildId}.json` });

                let role = message.guild.roles.cache.find(role => role.name == args.join(" ").split(args[0] + " ")[1]);
                if (!role) return message.reply({ content: "Không tìm thấy tên role này.", allowedMentions: { repliedUser: false } });

                if (data.get('restart-role'))
                    return message.reply({
                        content: "Bạn đã setup role restart rồi. Xoá role restart bằng lệnh " + client.PREFIX + "delete restart-role <Tên role>",
                        allowedMentions: { repliedUser: false }
                    });

                message.reply({ content: "Bạn đã restart role tên **" + role.name + "** thành công!", allowedMentions: { repliedUser: false } }).then(() => {
                    data.set('restart-role', role.id);
                });

                sendAfter();
            }
                break;

            case "restart": {
                if (!args[0]) return message.reply({ content: "Cách dùng: " + client.PREFIX + "setup restart <#Kênh>", allowedMentions: { repliedUser: false } });

                var channel = message.content.replace(/\D/g, '');
                if (!channel) channel = args[2];

                const data = new Database({ path: `./data/guilds/setup-${message.guildId}.json` });

                if (!data.get('restart')) return message.reply({ content: "Bạn đã setup restart rồi. Xoá restart bằng lệnh " + client.PREFIX + "delete restart <Kênh>", allowedMentions: { repliedUser: false } })

                if (isNaN(channel) || !client.channels.cache.get(channel)) return message.reply({ content: "Kênh không hợp lệ!", allowedMentions: { repliedUser: false } });

                if (data.get('livechat') == channel || data.get('connection') == channel)
                    return message.reply({ content: "Bạn không thể setup cùng kênh đã setup lúc trước.", allowedMentions: { repliedUser: false } });

                if (!message.guild.me.permissionsIn(channel).has(Permissions.FLAGS.SEND_MESSAGES))
                    return message.reply({ content: "Bot không có quyền gửi tin nhắn vào kênh này", allowedMentions: { repliedUser: false } });

                if (isNaN(channel) || !client.channels.cache.get(channel)) return message.reply({ content: "Kênh không hợp lệ!", allowedMentions: { repliedUser: false } });

                message.reply({ content: "Bạn đã setup kênh restart tại kênh: <#" + channel + "> thành công!", allowedMentions: { repliedUser: false } }).then(() => {
                    setTimeout(() => {
                        try {
                            client.channels.cache.get(channel).send("Cài đặt kênh restart thành công!").then(() => data.set('restart', channel));
                        } catch (e) {
                            message.channel.send({ content: "Bot không có quyền gửi tin nhắn vào kênh này, tiến hành xoá kênh restart.", allowedMentions: { repliedUser: false } });
                            data.delete('restart', channel);
                        }
                    }, 60 * 1000);
                });

                sendAfter();
            }
                break;

            default: {
                message.reply({ content: "Không thấy setting này. Cú pháp: " + client.PREFIX + "setup <livechat/connection/restart/restart-role>", allowedMentions: { repliedUser: false } });
            }
        }
    }
}