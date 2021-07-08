var log = require('../log');

module.exports = {
	name: 'guildCreate',
	once: false,
	execute(client, guild) {
        console.log(guild.name + " joined");
        log(guild.name + " joined");
    }
};