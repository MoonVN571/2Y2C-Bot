var Scriptdb = require('script.db');

module.exports = {
    name: "queue",
    description: "Xem hàng chờ bình thường",
    aliases: ['queue', 'q', 'que'],
    
    async execute(bot, username, args) {
        var data = new Scriptdb('./data.json');

        var queue = await data.get('queue') || "0 0";
        var prio = await data.get('prio') || "0 0";

        if(queue == undefined || prio == undefined) return bot.whisper(username, "> Không tìm thấy dữ liệu.");

        bot.whisper(username, `> Hàng chờ: ${queue.split(" ")[0]} - Ưu tiên: ${prio.split(" ")[0]}`);
    }
}