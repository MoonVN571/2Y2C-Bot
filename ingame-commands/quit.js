module.exports = {
    name: "quit",
    description: "quit command.",
    aliases: ['quit', 'leave'],
    
    async execute(bot, username, args) {
        if(!bot.dev) return;
        setTimeout(() => { bot.quit() }, 5*1000)
    }
}