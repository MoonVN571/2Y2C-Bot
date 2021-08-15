var log = require('../log');

module.exports = {
	name: 'guildDelete',
	once: false,
	execute(client, guild) {
		console.log(guild.name + " left");
        log(guild.name + " left");
    }
};