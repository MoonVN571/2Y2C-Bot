module.exports = {
    name: "queue",
    description: "queue command.",
    aliases: ['queue', 'q', 'que'],
    
    async execute(bot, username, args) {
        if (bot.api.getQueue() == 0) return bot.whisper(username, `> Không có bất kì hàng chờ nào.`);
        
        bot.whisper(username, `> Hàng chờ: ${bot.api.getQueue()} - Ưu tiên: ${bot.api.getPrio()}`);
    }
}