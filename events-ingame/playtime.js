var Scriptdb = require('script.db');

var oneInterval = false;
var returnThis = false;

module.exports = (bot) => {
    if(oneInterval) return;
    oneInterval = true;
    setInterval(() => {
        if(returnThis) return;
        returnThis = true;
        setTimeout(() => { returnThis = false }, 5*1000)
        if (bot.lobby) return;
        if (!bot.joined) return;
        Object.values(bot.players).forEach(player => addPlayTime(player.username));

        function addPlayTime(player) {
            let pt = new Scriptdb(`./data/playtime/${player}.json`);
            let playtime = pt.get('time')

            if (playtime === undefined) {
                pt.set('time', 10000);
            } else {
                pt.set('time', +playtime + 10000);
            }
        }
    }, 10 * 1000);
}