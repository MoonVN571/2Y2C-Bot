module.exports = {
    name: "quit",
    description: "quit command.",
    aliases: ['quit', 'leave'],
    
    async execute(bot, username, args) {
        if(bot.dev) {
            bot.quit();
        }
        if(username == bot.username) {
            bot.quit();
        }
    }
}