module.exports = {
    name: "buykit",
    description: "buykit command.",
    aliases: ['buykit'],
    
    async execute(bot, username, args) {
        bot.whisper(username, "Moon Shop : https://disord.gg/5Nh3tZB8nc");
    }
}