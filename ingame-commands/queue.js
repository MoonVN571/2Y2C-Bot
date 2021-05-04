var Scriptdb = require('script.db');
var data = Scriptdb('./data');


module.exports = {
    name: "queue",
    description: "queue command.",
    aliases: ['queue', 'q', 'que'],
    
    async execute(bot, username, args) {
        var queue = data.get('queue');
        var prio = data.get('prio');

        if(queue == undefined || prio == undefined) return bot.whisper(username, "> Không tìm thấy dữ liệu.");
                
        bot.whisper(username, `> Hàng chờ: ${queue} - Ưu tiên: ${prio}`);
    }
}