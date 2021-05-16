var Scriptdb = require('script.db');
var data = new Scriptdb('./data.json');

module.exports = {
    name: "prio",
    description: "prio command.",
    aliases: ['prioqueue'],
    
    async execute(bot, username, args) {
        var prio = data.get('prio');
        if(prio == undefined) return bot.whisper(username, "> Không tìm thấy dữ liệu.");

        if (prio.split(" | ")[0] == 0) return bot.whisper(username, `> Không có bất kì hàng chờ ưu tiên nào.`);

        bot.whisper(username, `> Ưu tiên: ${prio.split(" | ")[0]}`);
    }
}