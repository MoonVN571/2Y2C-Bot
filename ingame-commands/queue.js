var abc = require("../api");
var api = new abc();

module.exports = {
    name: "queue",
    description: "queue command.",
    aliases: ['queue', 'q', 'que'],
    
    async execute(bot, username, args) {
        if (api.getQueue() == 0) return bot.whisper(username, `> Không có bất kì hàng chờ nào.`);
        
        bot.whisper(username, `> Hàng chờ: ${api.getQueue()} - Ưu tiên: ${api.getPrio()}`);
    }
}