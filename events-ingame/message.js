var { MessageEmbed, Collection } = require('discord.js');

var a = require('../api');
var api = new a();

var Scriptdb = require('script.db');

module.exports = {
	name: 'message',
	once: false,
	execute(bot, client, msg) {
        var color = client.config.chatColor; // single channel
        var color2 = client.config.chatColor; // multi channel

        if (!(msg.toString().startsWith("<"))) return;

        var username = msg.toString().split(" ")[0].split("<")[1].split(">")[0];

        if(username.startsWith("[")) username = username.split("]")[1];

        logger = msg.toString().substr(msg.toString().split(" ")[0].length + 1);
    
        if (logger.startsWith(">")) color2 = client.config.chatColorHighlight;
    
        if(logger.startsWith("[") && username == bot.username) color2 = 0x4983e7;
        
        var chat = new MessageEmbed()
                        .setDescription(`**<${api.removeFormat(username)}>** ${api.removeFormat(logger)}`)
                        .setColor(color2);
    
        try {
            client.channels.cache.get(bot.defaultChannel).send(chat);
            color2 = "0x797979";
        } catch (e) {}

        // check if message start with > and change color 
        var setLogger = `**<${api.removeFormat(username)}>** ${api.removeFormat(logger)}`;

        client.guilds.cache.forEach((guild) => {
            const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
            const checkdata = data.get('livechat');
    
            if(checkdata == undefined || guild == undefined) return;
                    
            if(setLogger.split(" ")[1].startsWith(">")) color = client.config.chatColorHighlight;

            if(setLogger.split(" ")[0].startsWith("[") && username == bot.username) color = 0x4983e7;

            let embedChat = new MessageEmbed()
                        .setDescription(setLogger)
                        .setColor(color);

            if(bot.dev) return;

            try {
                client.channels.cache.get(checkdata).send(embedChat);
                color = client.config.chatColor;
            } catch(e) {}
        });
    
        saveMsgsData(username, logger);
        function saveMsgsData(username, logger) {
            let messages = new Scriptdb(`./data/quotes/${username}.json`);
            let msgs = messages.get("messages")
            let times = messages.get("times")

            if(msgs == undefined) {
                messages.set("messages", logger)
                messages.set("times", Date.now())
            } else {
                messages.set("messages", logger + " | " + msgs)
                messages.set("times", times + " | " + Date.now())
            }
        }
    
        if(!logger.startsWith(bot.prefix)) return;
        const args = logger.slice(bot.prefix.length).split(/ +/);
        const cmdName = args.shift().toLowerCase();

        const cmd = bot.commands.get(cmdName)
            || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
        
        if(!cmd) return;

        if(username.includes("§")) return bot.chat("Tên của bạn có ký tự đặc biệt. Hãy vào link: https://ghostbin.com/paste/xYaOP và làm theo hướng dẫn");
    
        bot.regex = /[a-z]|[A-Z]|[0-9]/i;
        bot.logger = logger;

        try {
            cmd.execute(bot, username, args);
        } catch(err) {
            console.log(err);
        }
    }
}