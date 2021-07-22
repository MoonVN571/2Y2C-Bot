var Scriptdb = require('script.db');

module.exports = {
    name: "normalqueue",
    description: "normalqueue command.",
    aliases: ['normalqueue', 'nq'],
    
    async execute(bot, username, args) {
	    var data = new Scriptdb(`./data.json`);

        var queue = await data.get('queue');
        if(queue == undefined) return bot.whisper(username, "> Không tìm thấy dữ liệu.");

        if (queue == 0) return bot.whisper(username, `> Không có ai trong hàng chờ cả.`);

        bot.whisper(username, `> Hàng chờ: ${queue}`);
    }
}