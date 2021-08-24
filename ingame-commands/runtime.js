var abc = require("../api");
var api = new abc();

module.exports = {
    name: "runtime",
    description: "Xem thời gian bot đã hoạt động trong server",
    aliases: ['runtime', 'uptime'],
    
    execute(bot, username, args) {
        bot.whisper(username, "> Uptime : " + api.uptimeCalc());
    }
}