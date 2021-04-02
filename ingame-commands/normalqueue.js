module.exports = {
    name: "normalqueue",
    description: "normalqueue command.",
    aliases: ['normalqueue', 'nq'],
    
    async execute(bot, username, args) {
        if (bot.api.getQueue() == 0) return bot.whisper(username, `> Không có bất kì hàng chờ nào.`);

        bot.whisper(username, `> Hàng chờ: ${bot.api.getQueue()}`);
    }
}