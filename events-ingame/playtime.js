var Scriptdb = require('script.db');
var log = require('../log');


module.exports = {
	name: 'login',
	once: true,
	execute(bot, client) {
        setInterval(() => {
            if (bot.lobby) return;
            if (!bot.joined) return;
            Object.values(bot.players).forEach(player => addPlayTime(player.username));

            log("Save tick all players is online");

            function addPlayTime(player) {
                let pt = new Scriptdb(`./data/playtime/${player}.json`);
                let playtime = pt.get('time');

                if (playtime === undefined) {
                    pt.set('time', 60000);
                } else {
                    pt.set('time', +playtime + 60000);
                }
            }
        }, 60 * 1000);
    }
}