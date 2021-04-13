var abc = require("../api");
var api = new abc();

module.exports = {
    name: "runtime",
    description: "runtime command.",
    aliases: ['runtime', 'uptime'],
    
    async execute(bot, username, args) {
        bot.whisper(username, "> Uptime : " + api.uptimeCalc());
    }
}