const { Client } = require('discord.js');
const { DEVELOPERS } = require('../config.json');
module.exports = {
	name: 'error',
	once: false,
    /**
     * 
     * @param {Client} client  
     */
	execute(client, e) {
        if(e) client.users.cache.get(DEVELOPERS).send(error);

        console.log(e);
        var error = err.toString();
        console.log('\n\n' + error);
    }
};