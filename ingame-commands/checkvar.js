module.exports = {
    name: "checkvar",
    description: "checkvar command.",
    aliases: ['checkvar', 'cv'],
    
    async execute(bot, username, args) {
        if(username == "MoonZ") {
            bot.whisper(username, "a:" + bot.lobby)
        }
    }
}