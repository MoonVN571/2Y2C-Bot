const { GoalFollow } = require('mineflayer-pathfinder').goals
const { Movements } = require('mineflayer-pathfinder')

module.exports = {
    name: "follow",
    description: "Cho bot đi theo bạn",

    execute(bot, username, args) {
		const mcData = require('minecraft-data')(bot.version)
		const defaultMove = new Movements(bot, mcData)

		const target = bot.players[username] ? bot.players[username].entity : null
		if (!target) return bot.whisper(username, '> Không ở trong tầm nhìn!');
		
		bot.whisper(username, "> Bot đang theo bạn! Nếu bot không di chuyển, hãy dùng !avoid.")

		bot.pathfinder.setMovements(defaultMove)
		bot.pathfinder.setGoal(new GoalFollow(target, 3), true)
    }
}