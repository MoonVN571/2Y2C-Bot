module.exports = {
    name: "ping",
    description: "Xem ping của bạn hoặc ai đó",
    
    execute(bot, username, args) {
        if(args[0]) {
            if(!args[0].toString().match(bot.regex)) return;
        } else {
            args[0] = username;
        }
        
        try {
            var ping = bot.players[args[0]].ping;
            if(ping == 0) {
                bot.whisper(username, "> Server chưa ping người chơi này..");
            } else {
                bot.whisper(username, "> " + args[0] + " : " + bot.players[args[0]].ping + "ms.");
            }
        } catch (e) {
            bot.whisper(username, "> Không tìm thấy người chơi.");
        }
    }
}