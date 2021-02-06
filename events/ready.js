const bot = require("../events-bot/bot")

var bot = require('events-bot/bot.js');

module.exports = (client) => {
    client.on('ready', () => {
        console.log('Bot online!');

        // create this bot
        bot.startBot(); 
    })
}