var Scriptdb = require("script.db");

module.exports = {
    name: "quotes",
    description: "quotes command.",
    aliases: ['quotes'],
    
    async execute(bot, username, args) {
        if(!args[0]) return;
        if(!args[0].match(bot.regex)) return;

        let quotes = new Scriptdb(`./data/quotes/${args[0]}.json`);
        var messages = quotes.get("messages");

        if(messages == undefined) return bot.whisper(username, "> Không tìm thấy người chơi.")

        let arrayMsgs = messages.split(" | ");

        var random = Math.floor(Math.random() * arrayMsgs.length);

        var dataMsgs = arrayMsgs[random];

        bot.whisper(username, `> ${args[0]}: ${dataMsgs}`);
    }
}