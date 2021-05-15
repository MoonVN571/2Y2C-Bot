var Scriptdb = require('script.db');

module.exports = (bot) => {
    setInterval(() => {

        if (bot.lobby) return;
        if (!bot.joined) return;
        Object.values(bot.players).forEach(player => addPlayTime(player.username));

        var today = new Date();
        var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();

        console.log("start " + time)

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