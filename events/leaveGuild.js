var log = require('../log');

module.exports = {
	name: 'guildDelete',
	once: false,
	execute(client, guild) {
        log(guild.name + " left");
    }
};