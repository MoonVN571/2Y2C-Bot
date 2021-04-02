module.exports = {
    name: "runtime",
    description: "runtime command.",
    aliases: ['runtime', 'uptime'],
    
    async execute(bot, username, args) {
        bot.whisper(username, "> Bot uptime: " + bot.api.uptimeCalc());
    }
}