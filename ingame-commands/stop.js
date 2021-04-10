module.exports = {
    name: "stop",
    description: "stop command.",
    aliases: [''],
    
    async execute(bot, username, args) {
        const target = bot.players[username] ? bot.players[username].entity : null
        if (!target) return bot.whisper(username, '> Không ở trong tầm nhìn!');
        
        bot.whisper(username, "> Đã ngưng path.");

        bot.pathfinder.setGoal(null);
    }
}