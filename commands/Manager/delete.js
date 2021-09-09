const Database = require('simplest.db');
const { Client, Message } = require("discord.js");
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
        var prefix = client.prefix;

        if (!args[0]) return message.reply({ content: "Cách dùng: " + prefix + "delete <livechat/connection/restart/restart-role>", allowedMentions: { repliedUser: false } });

        switch (args[0]) {
            case "livechat": {
                if (!args[1]) return message.reply({ content: "Cách dùng: " + prefix + "delete livechat <#kênh>", allowedMentions: { repliedUser: false } });

                var channel = message.content.replace(/\D/g, '');
                if (!channel) channel = args[2];

                const data = new Database({ path: `./data/guilds/setup-${message.guildId}.json` });

                if (!data.get('livechat')) return message.reply({ content: "Không tìm thấy kênh đã setup.", allowedMentions: { repliedUser: false } });

                message.reply({ content: "Bạn đã xoá chat tại channel: <#" + channel + ">", allowedMentions: { repliedUser: false } }).then(() => data.delete('livechat'));
            }
                break;

            case "connection": {
                if (!args[1]) return message.reply({ content: "Cách dùng: " + prefix + "delete connection <#kênh>", allowedMentions: { repliedUser: false } });

                var channel = message.content.replace(/\D/g, '');
                if (!channel) channel = args[2];

                const data = new Database({ path: `./data/guilds/setup-${message.guildId}.json` });

                if (!data.get('connection')) return message.reply({ content: "Không tìm thấy kênh đã setup.", allowedMentions: { repliedUser: false } });

                message.reply({ content: "Bạn đã xoá kênh connection tại channel: <#" + channel + ">", allowedMentions: { repliedUser: false } }).then(() => data.delete('connection'));
            }
                break;

            case "restart": {
                if (!args[1]) return message.reply({ content: "Cách dùng: " + prefix + "delete restart <#kênh>", allowedMentions: { repliedUser: false } });

                var channel;
                channel = message.content.replace(/\D/g, '');
                if (channel) channel = args[2];

                const data = new Database({ path: `./data/guilds/setup-${message.guildId}.json` });

                if (!data.get('restart')) return message.reply({ content: "Không tìm thấy kênh đã setup.", allowedMentions: { repliedUser: false } });

                message.reply({ content: "Bạn đã xoá kênh restart tại channel: <#" + args[2] + ">", allowedMentions: { repliedUser: false } });
                data.delete('restart');
            }
                break;

            case "restart-role": {
                if (!args[1]) return message.reply({ content: "Cách dùng: " + prefix + "delete restart-role <tên role>", allowedMentions: { repliedUser: false } });

                const data = new Database({ path: `./data/guilds/setup-${message.guildId}.json` });

                if (!data.get('restart-role')) return message.reply({ content: "Không tìm thấy role đã setup.", allowedMentions: { repliedUser: false } });

                message.reply({ content: "Bạn đã restart role id **" + data.get('restart-role') + "** thành công!", allowedMentions: { repliedUser: false } }).then(() => data.delete('restart-role'));
            }

            default: {
                message.reply({ content: "Không thấy setting này. Cú pháp: " + client.client.config.prefix + "delete <chat/connection/restart/restart-role>", allowedMentions: { repliedUser: false } });
            }
        }
    }
}