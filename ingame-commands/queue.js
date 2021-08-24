var Scriptdb = require('script.db');

module.exports = {
    name: "queue",
    description: "Xem hàng chờ bình thường",
    aliases: ['queue', 'q', 'que'],
    
    async execute(bot, username, args) {
        var data = new Scriptdb('./data.json');

        var queue = await data.get('queue');
        var prio = await data.get('prio');

        if(queue == undefined || prio == undefined) return bot.whisper(username, "> Không tìm thấy dữ liệu.");

        bot.whisper(username, `> Hàng chờ: ${queue} - Ưu tiên: ${prio}`);
    }
}