var Scriptdb = require("script.db");

var a = require('../api');
var api = new a();

module.exports = {
    name: "lastwords",
    description: "lastwords command.",
    aliases: [''],
    
    async execute(bot, username, args) {
		let quote = new Scriptdb(`${config.disk}/data/quotes/${args[0]}.json`)
		let msgs = quote.get('messages')
		let times = quote.get('times')
        
        if (msgs === undefined || times == undefined) return bot.whisper(username, "> không tìm thấy người chơi."); 
        
		var data = msgs.split(" | ")[1];
		var time = times.split(" | ")[times.split(" | ").length - 1];
        
        bot.whisper(username, `${api.ageCalc(time)} trước: <${args[0]}> ${data}`);
    }
}