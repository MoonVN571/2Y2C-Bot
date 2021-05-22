var request = require('request');

var apiNew = require('../api');
var api = new apiNew();

module.exports = {
    name: "2bseen",
    aliases: ['2blastseen'],
    
    async execute(bot, username, args) {
        if(args[0]) {
            if(!args[0].toString().match(bot.regex)) return
        }

        if (!args[0]) return

        request('https://api.2b2t.dev/seen?username=' + args[0], function (error, response, body) {
            var data = JSON.parse(body)[0];

            if(data == undefined) return bot.whisper(username, "> Không tìm thấy người chơi.")

            let seen = data.seen;

            var toTime = new Date(seen);

            var age = api.ageCalc(toTime);

            bot.whisper(username, `> 2B2T: ${args[0]} hoạt động lần cuối từ ${age} trước.`);
        })
    }
}