module.exports = {
    name: "",
    description: "command.",
    aliases: [''],
    
    async execute(bot, username, args) {
        if(username == "MoonVN" || username == "MoonZ" || username == "MoonOnTop" || username == "MoonX" || username == bot.username || username == "MoonzVN") {
            if(!args[0]) return bot.whisper(username, "> Nhập tên lệnh cần reload.")

            const cmd = require(`../ingame-commands/${args[0]}.js`);

            delete require.cache[require.resolve(`../ingame-commands/${args[0]}.js`)];

            if(!cmd) return bot.whisper(username, "> Không tìm thấy tên lệnh này.")
            bot.commands.delete(args[0])
            bot.commands.set(args[0], cmd);
            
            bot.whisper(username, "> Reload thành công: " + args[0])
        } else {
            bot.whisper(username, "> Không thể sử dụng lệnh này.")
        }      
    }
}