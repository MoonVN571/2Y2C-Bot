module.exports = {
    name: "quit",
    description: "command.",
    aliases: ['quit'],
    
    async execute(bot, username, args) {
        if(!bot.dev) return;
        bot.quit()
    }
}