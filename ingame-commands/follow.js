module.exports = {
    name: "follow",
    description: "follow command.",
    aliases: ['follow'],
    
    async execute(bot, username, args) {
		if(!bot.dev) return;
        bot.whisper(username, "> following")
		const mcData = require('minecraft-data')('1.16.5')
	  
		const defaultMove = new bot.Movements(bot, mcData)

		const target = bot.players[username] ? bot.players[username].entity : null
		const p = target.position

		bot.chat("Target is " + target)
		if (!target) return;
	
		bot.pathfinder.setMovements(defaultMove)
		bot.pathfinder.setGoal(new bot.GoalNear(p.x, p.y, p.z, 3))
    }
}