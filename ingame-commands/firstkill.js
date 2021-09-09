const Scriptdb = require("script.db");
const api = require('../utils');
module.exports = {
    name: "firstkill",
    description: "Xem lần tin nhắn lần đầu giết người chơi",
    
    execute(bot, username, args) {
        if(!args[0]) return bot.whisper(username, '> Không tìm thấy người chơi.');
        if(!args[0].match(bot.regex)) return;
        
		let quote = new Scriptdb(`./data/kills/${args[0]}.json`)
		let msgs = quote.get('deaths')
		let times = quote.get('times')
		
		if (msgs === undefined || times == undefined) return bot.whisper(username, '> Không tìm thấy người chơi.');

		var data = msgs.split(" | ")[msgs.split(" | ").length - 1];
		var time;

        try {
            data = msgs.split(" | ")[msgs.split(" | ").length - 1];
        } catch(e) {
            data = msgs;
        }

        try {
            time = times.split(" | ")[times.split(" | ").length - 1]
        } catch(e) {
            time = times;
        }

        let timed = time ? api.ageCalc(time) : "Không rõ";

        bot.whisper(username, `> ${args[0]} [${timed} trước]: ${data}`);
    }
}