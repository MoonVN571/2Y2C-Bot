var request = require('request');

module.exports = {
    name: "2bstats",
    aliases: [''],
    
    async execute(bot, username, args) {
        if(args[0]) {
            if(!args[0].toString().match(bot.regex)) return;
        }

        if(!args[0]) return


        request("https://api.2b2t.dev/stats?username=" + args[0], function (error, response, body) {
            var data = JSON.parse(body)[0];
            if(data == undefined) return message.channel.send(client.userNotFound)

            let joins = data.joins
            let leaves = data.leaves
            let deads = data.deaths
            let kills = data.kills

            if (kills === undefined) { kills = 0 }

            if (deads === undefined) { deads = 0 }

            var ratio = kills / deads;
            var ratioFixed = ratio.toFixed(2);

            if (ratioFixed === "NaN" || ratioFixed === "Infinity") {
                ratioFixed = "0.00";
            }

            bot.whisper(username, `> 2B2T: ${args[0]} | K: ${kills} - D: ${deads} - K/D: ${ratioFixed} - Joins: ${joins} - Leaves: ${leaves}`);
        })
    }
}