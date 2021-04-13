var abc = require("../api");
var api = new abc();

module.exports = {
    name: "prio",
    description: "prio command.",
    aliases: ['prio', 'prioqueue'],
    
    async execute(bot, username, args) {
        var prio = api.getPrio();
        
        if (prio == 0) return bot.whisper(username, `> Không có bất kì hàng chờ ưu tiên nào.`);

        bot.whisper(username, `> Ưu tiên: ${prio}`);
    }
}