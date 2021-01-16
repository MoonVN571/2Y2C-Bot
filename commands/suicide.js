exports.run = (bot, name, logger) => {
	if(logger.startsWith("!kill") || logger.startsWith('!suicide')) {
		bot.chat('/suicide')
	}
}