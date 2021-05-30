var Scriptdb = require('script.db');

var a = require('../api');
var api = new a();

module.exports = {
    name: "joindate",
    description: "joindate command.",
    aliases: ['jd', 'joindate'],
    
    async execute(bot, username, args) {
        if(!args[0]) return;
        if(!args[0].match(bot.regex)) return;

        let fj = new Scriptdb(`./data/joindate/${args[0]}.json`);
        let firstjoin = fj.get('date');

        if (firstjoin === undefined) return bot.whisper(username, `> Không tìm thấy người chơi.`);
        
        var t = firstjoin.split(" ")[1];

        var date = firstjoin.replace('/', '-').replace(".", "-").replace('.2', '-202').replace("/2", '-202')

        var day = date.split("-")[0]
        var month = date.split("-")[1]
        var year = date.split("-")[2].split(" ")[0];


        var datee = year + '-' + month + '-' + day + "T" + t.replace(" ", "T") + ":55.506Z";

        var tick = new Date(datee).getTime();

        bot.whisper(username, `> ${args[0]}: ${firstjoin} (${api.agecalc(tick)} trước)`);
    }
}