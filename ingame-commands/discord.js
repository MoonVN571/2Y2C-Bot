module.exports = {
    name: "discord",
    description: "discord command.",
    aliases: ['discord'],
    
    async execute(bot, username, args) {
        bot.whisper(username, `> Discord Bot : http://discord.gg/yrNvvkqp6w`)
    }
}