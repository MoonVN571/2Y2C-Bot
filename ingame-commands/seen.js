var abc = require("../api");
var api = new abc();

var Scriptdb = require("script.db");

module.exports = {
    name: "seen",
    description: "seen ommand.",
    aliases: ['seen'],
    
    async execute(bot, username, args) {
        if(!args[0]) return;
        if(!args[0].match(bot.regex)) return;

        let ls = new Scriptdb(`./data/seen/${args[0]}.json`);
        var seen = ls.get('seen');

        if (seen === undefined) return bot.whisper(username, `> Không tìm thấy người chơi.`);

        var age = api.ageCalc(seen);
        bot.whisper(username, `> ${args[0]} hoạt động lần cuối từ ${age} trước.`);
    }
}