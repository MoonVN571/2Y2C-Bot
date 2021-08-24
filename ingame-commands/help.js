module.exports = {
    name: "help",
    description: "Xem lệnh hướng dẫn",

    execute(bot, username, args) {
        if(args[0]) {
            let cmdName = arg[0];
            const cmd = bot.commands.get(cmdName)
                || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
            
            if(!cmd) return bot.whisper(username, "> Không tìm thấy lệnh này.");

            bot.whisper(username, "> " + cmd.name + ": " + cmd.description);
        }

        bot.whisper(username, '> Xem tại : http://mo0nbot.tk/ - Gõ ' + bot.prefix + "help <tên lệnh> để xem công dụng");
    }
}