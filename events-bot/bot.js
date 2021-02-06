// const mc = require("minecraft-protocol")

module.exports = (mineflayer) => {
	const bot = mineflayer.createBot({
		host: config.ip,
		port: 25565,
		username: devuser,
		version: "1.12.2"
	}); // Start bot

}