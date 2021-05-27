module.exports = {
    name: "discord",
    description: "discord command.",
    aliases: [''],
    
    async execute(bot, username, args) {
        bot.whisper(username, `> Discord : http://discord.gg/yrNvvkqp6w`)
    }
}