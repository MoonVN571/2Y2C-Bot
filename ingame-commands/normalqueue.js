var Scriptdb = require('script.db');

module.exports = {
    name: "normalqueue",
    description: "Xem hàng chờ 2y2c",
    aliases: ['normalqueue', 'nq'],
    
    async execute(bot, username, args) {
	    var data = new Scriptdb(`./data.json`);

        var queue = await data.get('queue') || "0 0";
        if(queue == undefined) return bot.whisper(username, "> Không tìm thấy dữ liệu.");

        if (queue == 0) return bot.whisper(username, `> Không có ai trong hàng chờ cả.`);

        bot.whisper(username, `> Hàng chờ: ${queue.split(" ")[0]}`);
    }
}