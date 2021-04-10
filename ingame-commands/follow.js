const { GoalFollow } = require('mineflayer-pathfinder').goals
const { Movements } = require('mineflayer-pathfinder')

module.exports = {
    name: "follow",
    description: "follow command.",
    aliases: ['follow'],
    
    async execute(bot, username, args) {
		const mcData = require('minecraft-data')(bot.version)
		const defaultMove = new Movements(bot, mcData)

		const target = bot.players[username] ? bot.players[username].entity : null
		if (!target) return bot.whisper(username, '> Không ở trong tầm nhìn!');
		
		bot.whisper(username, "> Đang theo " + username)

		bot.pathfinder.setMovements(defaultMove)
		bot.pathfinder.setGoal(new GoalFollow(target, 3), true)
    }
}