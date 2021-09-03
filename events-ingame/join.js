var { MessageEmbed } = require('discord.js');
var Scriptdb = require('script.db');
var fs=  require('fs');

var ap = require('../api');
var api = new ap();

const log = require('../log');


module.exports = {
	name: 'playerJoined',
	once: false,
	execute(bot, client, p) {
        bot.countPlayers++;
        var username = p.username;

        var d = new Date();
        var time = d.getTime();
        let lastseen = new Scriptdb(`./data/seen/${username}.json`);
        var ls = lastseen.get('seen')

        if (ls === undefined) {
            lastseen.set('seen', time);
        } else {
            lastseen.set('seen', time);
        }
        
        var today = new Date()
        let day = ("00" + today.getDate()).slice(-2)
        let month = ("00" + (today.getMonth() + 1)).slice(-2)
        let years = ("00" + today.getFullYear()).slice(-2)
        let hours = ("00" + today.getHours()).slice(-2)
        let min = ("00" + today.getMinutes()).slice(-2)
        var date = day + '.' + month + '.' + years + ' ' + hours + ':' + min;

        let fj = new Scriptdb(`./data/joindate/${username}.json`);
        if (!fj.get('date')) fj.set(`date`, date);

        var data = new Scriptdb(`./offlinemsgs.json`);
        if(data.get(username + '.author') !== undefined) {
            var author = data.get(username + '.author');
            var time = api.ageCalc(data.get(author + '.' + username +'.time'));

            var authorMsg = data.get(author + '.' + username);

            bot.whisper(username, `Tin nhắn chờ từ ${author} [${time} trước]: ${authorMsg}`);
            
            log("Sending message to online player with offlinemsgs.")

            data.delete(username + '.author');
            data.delete(author + '.' + username +'.time');
            data.delete(author + '.' + username);
        }

        fs.readFile("special-join.txt", 'utf8', (err, data) => {
            if (err) throw err;
            if(data.toString().split("\r\n").indexOf(username) > -1) {
                if(bot.dev) return;
                var embed = new MessageEmbed()
                    .setDescription("Bot đã vào server và " + api.removeFormat(username) + " đang online.")
                    .setColor(0xb60000);

                client.channels.cache.get("807506107840856064").send({embeds: [embed]});
            }
        });

        
        if(bot.countPlayers <= Object.values(bot.players).map(p => p.username).length) return;

        fs.readFile("special-join.txt", 'utf8', (err, data) => {
            if (err) throw err;
            if(data.toString().split("\r\n").indexOf(username) > -1) {
                if(bot.dev) return;
                var embed = new MessageEmbed()
                    .setDescription(api.removeFormat(username) + " đã tham gia vào server.")
                    .setColor(0xb60000);

                client.channels.cache.get("807506107840856064").send({embeds: [embed]});
            }
        });

        var embed = new MessageEmbed()
                    .setDescription(api.removeFormat(username) + " đã tham gia vào server.")
                    .setColor(0xb60000);

        if(bot.dev) client.channels.cache.get("882849908892254230").send({embeds: [embed]});
        if(!bot.dev) client.channels.cache.get("882817156977410049").send({embeds: [embed]});
    }
}