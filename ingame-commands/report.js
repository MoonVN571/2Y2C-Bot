module.exports = {
    name: "report",
    description: "report command.",
    aliases: ['report'],
    
    async execute(bot, username, args) {
        if(!args[0]) return;
        if(!args[0].toString().match(bot.regex)) return bot.whisper(username, "> Ký tự không hợp lệ.");

        if(args[0] == username) return bot.whisper(username, "> Không thể báo cáo bản thân.");

        var name = Object.values(bot.players).map(p => p.username);
        
        if(!name.toString().includes(args[0])) return bot.whisper(username, "> Người chơi không hoạt động.")

            if(args == bot.username) return bot.whisper(username, "> Bạn không thể báo cáo staff của server.");	
            
            bot.whisper(username, `> Bạn đã báo cáo người chơi tên ${args[0]}, BOT sẽ xử lý báo cáo này trong thời gian ngắn nhất!`)
        }
}