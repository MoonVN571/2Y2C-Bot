
const { Movements } = require('mineflayer-pathfinder')
const { GoalFollow, GoalInvert } = require('mineflayer-pathfinder').goals

module.exports = {
    name: "avoid",
    description: "Tránh",

    execute(bot, username, args) {
		const mcData = require('minecraft-data')(bot.version)
		const defaultMove = new Movements(bot, mcData)

		const target = bot.players[username] ? bot.players[username].entity : null
		if (!target) return bot.whisper(username, '> Không ở trong tầm nhìn!');

        bot.pathfinder.setMovements(defaultMove)
        bot.pathfinder.setGoal(new GoalInvert(new GoalFollow(target, 5)), true)
    }
}