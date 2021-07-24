const { Client } = require('discord.js');
const client = new Client();

require('dotenv').config();

const config = {
	token: process.env.TOKEN,
}

client.login(config.token, (err) => console.log(err));

const request = require('request');
const mc = require('minecraft-protocol');

client.on('ready', () => {
    console.log("Bot loggedin with " + client.user.tag);

    setInterval(() => {
        request('http://mo0nbot.tk/api/status', function (error, response, body) {
            let tps = JSON.parse(body)[0];
            // console.log(tps);
            
            mc.ping({ "host": "2y2c.org" }, (err, result) => {
                if (result) {
                    try {
                        var players = [];
                        for (i = 0; result.players.sample.length > i; i++) {
                            players.push(result.players.sample[i].name);
                        }
                        var players2 = players.splice(0, Math.ceil(players.length / 2));
                        if (players == []) {
                            players.push(players2);
                            players2 = ".";
                        }
                    } catch {
                        var players = 'Error';
                        var players2 = 'Error';
                    }

                    var old = players.toString().replace(",§6Cựu binh: §l0", "");
                    var queue = old.toString().replace("§6Bình thường: §l", "");
                    var prio = players2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");

                    client.user.setActivity(`TPS: ${tps} - Queue: ${queue} - ${prio} ~ $help for cmds`, {type: "PLAYING"})
                }
            });
        });
    }, 5 * 60 * 1000);
})