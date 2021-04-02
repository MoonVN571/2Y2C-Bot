module.exports = {
    name: "kill",
    description: "kill command.",
    aliases: ['kill', 'killbot', 'suicide'],
    
    async execute(bot, username, args) {
        if (bot.dev) return;
        bot.chat('/kill');
    }
}