const { MessageEmbed, Client } = require('discord.js');
const { Bot } = require('mineflayer');
const api = require('../utils');
const Database = require('simplest.db');
const cfDir = require('../config.json');
const { sendLivechat } = require('../functions');
module.exports = {
    name: 'message',
    once: false,
    /**
     * 
     * @param {Bot} bot 
     * @param {Client} client 
     * @param {String} message 
     */
    async execute(bot, client, message) {
        let msg = message.toString();
        if (!msg.startsWith("<")) return;

        let username = msg.split(" ")[0].split("<")[1].split(">")[0];
        if (username.startsWith("[")) username = username.split("]")[1];
        
        let color = 0x979797;
        let logger = msg.substr(msg.split(" ")[0].length + 1);
        if (logger.startsWith(">")) color = 0x2EA711;
        if (logger.startsWith("[") && username == bot.username) color = 0x4983e7; // bot highlight

        let embedChat = new MessageEmbed()
            .setDescription(`**<${api.removeFormat(username)}>** ${api.removeFormat(logger)}`)
            .setColor(color);

        await sendLivechat({ embeds: [embedChat] });

        saveMsgsData(username, logger);
        function saveMsgsData(username, logger) {
			const messages = new Database({path:`./data/quotes/setup-${username}.json`});
            let msgs = messages.get("messages")
            let times = messages.get("times")

            if (!msgs) {
                messages.set("messages", logger)
                messages.set("times", Date.now())
            } else {
                messages.set("messages", logger + " | " + msgs)
                messages.set("times", times + " | " + Date.now())
            }
        }

        if (!logger.startsWith(bot.prefix)) return;
        const args = logger.slice(bot.prefix.length).split(/ +/);
        const cmdName = args.shift().toLowerCase();

        const cmd = bot.commands.get(cmdName)
            || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

        if (!cmd) return;

        if (username.includes("§")) return bot.chat("Tên của bạn có ký tự đặc biệt. Hãy vào link: https://ghostbin.com/paste/xYaOP và làm theo hướng dẫn");

        bot.regex = /[a-z]|[A-Z]|[0-9]/i;
        bot.logger = logger;

        if (cmd.admin && !(username == "MoonVN" || username == "MoonZ" || username == "MoonOnTop" || username == "MoonX" || username == bot.username || username == "MoonzVN")) return;

        cmd.execute(bot, username, args);
    }
}