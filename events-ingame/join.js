const { MessageEmbed } = require('discord.js');
const api = require('../utils');
const server = require('../model/server-model');
const { sendConnection } = require('../functions');
const Database = require('simplest.db');
module.exports = {
    name: 'playerJoined',
    once: false,
    async execute(bot, client, p) {
        bot.countPlayers++;
        let username = p.username;

        async function checkOld(before) {
            let svData = await server.findOne({})?.oldfag;
            if(svData?.indexOf(username) < 0) return;

            let content = api.removeFormat(username) + " đã tham gia vào server.";
            if(before) content = "Bot đã vào server và " + api.removeFormat(username) + " đang online.";

            let embed = new MessageEmbed()
                .setDescription(content)
                .setColor(0xb60000);

            client.channels.cache.get("807506107840856064").send({ embeds: [embed] });
        }

        if (bot.countPlayers <= Object.values(bot.players).map(p => p.username).length) return checkOld(true);
        else checkOld(false);
        
        let embed = new MessageEmbed()
            .setDescription(api.removeFormat(username) + " đã tham gia vào server.")
            .setColor(0xb60000);

        sendConnection({ embeds: [embed] });

        let seen = new Database({path: './data/seen/' + username + '.json'});
        seen.set('seen', Date.now());

        let today = new Date()
        let day = ("00" + today.getDate()).slice(-2)
        let month = ("00" + (today.getMonth() + 1)).slice(-2)
        let years = ("00" + today.getFullYear()).slice(-2)
        let hours = ("00" + today.getHours()).slice(-2)
        let min = ("00" + today.getMinutes()).slice(-2)
        let date = day + '.' + month + '.' + years + ' ' + hours + ':' + min;

        let joindate = new Database({path: './data/joindate/' + username + '.json'});
        if(!joindate.get('date')) joindate.set('date', date);s

        let dataOmsgs = await offlineMsg.findOne({ sendAuthor: username });

        if(dataOmsgs) {
            let userSend = dataOmsgs.sendAuthor;

            asyncForEach(userSend.data, async (data) => {
                await sleep(11000);
                let timeFormat = api.ageCalc(data.timestamp);
                let content = data.message;
                let author = data.username;

                bot.whisper(username, `Tin nhắn chờ từ ${author} [${timeFormat} trước]: ${content}`);
                
                userSend.data = userSend.data.filter(data => data.author !== author);
            });
        }

        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }
    }
}