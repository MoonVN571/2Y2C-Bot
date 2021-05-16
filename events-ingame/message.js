var Discord = require('discord.js');
var Scriptdb = require('script.db');

var color = "0x979797";
var color2 = "0x979797";

var abc = require("../api")
var api = new abc();

module.exports = (bot, client, msg) => {
    if (!(msg.toString().startsWith("<"))) return;

    var username = msg.toString().split(" ")[0].split("<")[1].split(">")[0];

    if(username.startsWith("[")) {
        username = username.split("]")[1]
    }

    logger = msg.toString().substr(msg.toString().split(" ")[0].length + 1);

    if (logger.startsWith(">")) {
        color2 = "2EA711";
    }

    var bp;
    if (bot.dev) {
        bp = "!!";
    } else {
        bp = "!";   
    }
    
    if (username === "Ha_My" || username == "PhanThiHaMy" || username == "_Mie_Cutee_") {
        if(bot.dev) return;
        client.channels.cache.get("839115042405482576").send("**<" + api.removeFormat(username) + ">** " + api.removeFormat(logger));
    }
    
    var chat2 = new Discord.MessageEmbed()
                    .setDescription(`**<${api.removeFormat(username)}>** ${api.removeFormat(logger)}`)
                    .setColor(color2);

    var setLogger = `**<${api.removeFormat(username)}>** ${api.removeFormat(logger)}`;
    setTimeout(() => {
        var guild = client.guilds.cache.map(guild => guild.id);
        setInterval(() => {
            if (guild[0]) {
                const line = guild.pop()
                const data = new Scriptdb(`./data/guilds/setup-${line}.json`);
                const checkdata = data.get('livechat');

                if(checkdata == undefined || guild == undefined) return;
                
                if(setLogger.split(" ")[1].startsWith(">")) {
                    color = "2EA711";
                }

                var chat = new Discord.MessageEmbed()
                            .setDescription(setLogger)
                            .setColor(color);

                if(bot.dev) return;
                if(chat == undefined) return;

                try {
                    client.channels.cache.get(checkdata).send(chat)
                    color = "0x797979";
                } catch(e) {}
            }
        }, 100);
    }, 100)

    if(chat2 !== undefined) {
        client.channels.cache.get(bot.defaultChannel).send(chat2);
        color2 = "0x797979";
    }

    saveMsgsData(username, logger);
    function saveMsgsData(username, logger) {
        if(logger.startsWith(bp)) return;
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

    if(logger.includes("bán kit ko") || logger.includes("ban kit") || logger.includes('sell kit')) {
        bot.whisper(username, "> Moon Shop: moonz.ga/moonshop");
    }

    if(!logger.startsWith(bp)) return;
    const args = logger.slice(bp.length).split(/ +/);
    const cmdName = args.shift().toLowerCase();

    client.commands = new Discord.Collection();

    const cmds = require('fs').readdirSync(`../ingame-commands/`).filter(file => file.endsWith('.js'));

    for(const file of cmds){
        const cmd = require(`../ingame-commands/${file}`);
        
        client.commands.set(cmd.name, cmd);
    }

    const cmd = client.commands.get(cmdName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

    if(cmdName == "reload") {
        if(username == "MoonVN" || username == "MoonZ" || username == "MoonOnTop") {
            if(!args[0]) return bot.whisper(username, "> Nhập tên lệnh cần reload.")

            const cmd = require(`../ingame-commands/${args[0]}.js`);

            delete require.cache[require.resolve(`../ingame-commands/${args[0]}.js`)];

            if(!cmd) return bot.whisper(username, "> Không tìm thấy tên lệnh này.")
            client.commands.delete(args[0])
            client.commands.set(args[0], cmd);
            
            bot.whisper(username, "> Reload thành công: " + args[0])
        } else {
            bot.whisper(username, "> Không thể sử dụng lệnh này.")
        }
    }

    if(command == "sudo") {
        if(!args[0]) return bot.whisper(username, "Không tìm thấy nội dung.")
        
        if(username == "MoonVN" || username == "MoonZ" || username == "MoonOnTop") {
            bot.chat(logger.substr(6));
            bot.whisper(username, "Đang thực hiện: " + logger.substr(6))
        }
    }
    
    if(!cmd) return;

    bot.regex = /[a-z]|[A-Z]|[0-9]/i;

    setTimeout(() => {
        try {
            cmd.execute(bot, username, args);
        }catch(err){
            console.log(err);
        }
    }, 1* 1000);
}