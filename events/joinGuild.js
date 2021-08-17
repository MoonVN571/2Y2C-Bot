var log = require('../log');

module.exports = {
	name: 'guildCreate',
	once: false,
	execute(client, guild) {
        if(!guild.name) return;
        console.log(guild.name + " joined");
        log(guild.name + " joined");
    }
};