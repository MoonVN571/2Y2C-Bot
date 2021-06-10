var Scriptdb = require('script.db');
const data = new Scriptdb(`../data.json`);

module.exports = {
    name: "normalqueue",
    description: "normalqueue command.",
    aliases: ['normalqueue', 'nq'],
    
    async execute(bot, username, args) {
        var queue = data.get('queue');
        if(queue == undefined) return bot.whisper(username, "> Không tìm thấy dữ liệu.");

        if (queue == 0) return bot.whisper(username, `> Không có bất kì hàng chờ nào.`);

        bot.whisper(username, `> Hàng chờ: ${queue}`);
    }
}