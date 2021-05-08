var Scriptdb = require('script.db');
var data = new Scriptdb('./data');

module.exports = {
    name: "queue",
    description: "queue command.",
    aliases: ['queue', 'q', 'que'],
    
    async execute(bot, username, args) {
        console.log(data)
        var queue = data.get('queue');
        var prio = data.get('prio');

        if(queue == undefined || prio == undefined) return bot.whisper(username, "> Không tìm thấy dữ liệu.");
                
        bot.whisper(username, `> Hàng chờ: ${queue.split(" | ")[0]} - Ưu tiên: ${prio.split(" | ")[0]}`);
    }
}