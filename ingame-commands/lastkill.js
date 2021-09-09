var Scriptdb = require("script.db");
const api = require('../utils');
module.exports = {
    name: "lastkill",
    description: "Xem tin nhắn giết người mới nhất",

    execute(bot, username, args) {
        if(!args[0]) return bot.whisper(username, '> Không tìm thấy người chơi.');
        if(!args[0].match(bot.regex)) return;

		let quote = new Scriptdb(`./data/kills/${args[0]}.json`)
		let msgs = quote.get('deaths')
		let times = quote.get('times')
		
		if (msgs === undefined || times == undefined) return bot.whisper(username, '> Không tìm thấy người chơi.');

		var data;
		var time;

        try {
            data = msgs.split(" | ")[0];
        } catch(e) {
            data = msgs;
        }

        try {
            time = times.split(" | ")[0];
        } catch(e) {
            time = times;
        }

        let timed = time ? api.ageCalc(time) : "Không rõ";

        bot.whisper(username, `> ${args[0]} [${timed} trước]: ${data}`);
    }
}