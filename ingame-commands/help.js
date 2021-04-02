module.exports = {
    name: "help",
    description: "help command.",
    aliases: ['help'],
    
    async execute(bot, username, args) {
        bot.whisper(username, '> Xem tại : https://mo0nbot.tk/')
    }
}