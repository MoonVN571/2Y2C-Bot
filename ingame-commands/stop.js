module.exports = {
    name: "stop",
    description: "Cho bot dừng lại",
    
    execute(bot, username, args) {
        const target = bot.players[username] ? bot.players[username].entity : null
        if (!target) return bot.whisper(username, '> Không ở trong tầm nhìn!');
        
        bot.whisper(username, "> Đã ngưng path.");

        bot.pathfinder.setGoal(null);
    }
}