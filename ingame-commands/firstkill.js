var Scriptdb = require("script.db");

var a = require('../api');
var api = new a();

module.exports = {
    name: "firstkill",
    
    async execute(bot, username, args) {
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

        bot.whisper(username, `> ${args[0]} [${api.ageCalc(time)} trước]: ${data}`);
    }
}