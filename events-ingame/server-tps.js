const Scriptdb = require('script.db');

const { MessageEmbed } = require('discord.js');

const log = require('../log');

var e = require('../gotEvent');

var event = new e();


module.exports = {
	name: 'login',
	once: false,
	execute(bot, client) {
        if(bot.dev) return;

        if(event.getTPS()) return;

        setInterval(checkLag, 15000)

        let isLagging = false
        let minTps
        let lagStartTime
        let tpsAvg
        let tpsCount
        
        function readTPS(){
            try {
                let tps = new Scriptdb('./data.json').get('tab-content').split(" ")[2];
                if(tps == undefined) tps = 0;
                return tps;
            } catch(e) {}
        }

        var tps = 0;

        function checkLag(){
            if(readTPS() == 0) return;
                tps = readTPS()

            log("Got TPS: " + tps)
            tps = parseFloat(tps)
            if(tps > 0 && tps <= 8 || tps > 20){
                if(isLagging == false){
                    var embedLag = new MessageEmbed().setColor(0xCC3333).setDescription("Server đã bắt đầu lag với **" + tps + "** tps.");
                    client.channels.cache.get("852158457624657941").send({embeds: [embedLag]});
                    log("2Y2C has started lagging. TPS: " + tps)
                    lagStartTime = Date.now()
                    minTps = tps
                    tpsAvg = tps
                    tpsCount = 1
                    isLagging = true
                    return
                }

                if(isLagging){
                    tpsAvg = tpsAvg + tps
                    tpsCount = tpsCount + 1
                    if(minTps > tps){
                        minTps = tps
                    }

                    if(tps <= 2){
                        totalPoints = totalPoints + (1 / Math.sqrt(tpsAvg/tpsCount))
                    }

                    if(tps > 20 || tps < 0){
                        log("Non real TPS! TPS: " + tps)
                        totalPoints = totalPoints + (1 / Math.sqrt(tpsAvg/tpsCount)) + (15/4)
                    }
                }
            }

            if(tps > 16 && tps <= 20){
                if(!isLagging) return;
                log("2Y2C has stopped lagging.");

                if(isLagging){
                    isLagging = false
                    tpsAvg = tpsAvg/tpsCount
                    let uptimesec = (Date.now() - lagStartTime) /  1000
                    let hours = Math.floor(uptimesec / 60 / 60);
                    let minutes = Math.floor(uptimesec / 60) - (hours * 60);
                    let seconds = Math.floor(uptimesec % 60);

                    let lagEmbed = new MessageEmbed()
                    .setColor('#CC3333')
                    .setAuthor('Moon Bot', 'https://cdn.discordapp.com/avatars/768448728125407242/f18ec971961b23db96e6cf0f3f79ec1c.png?size=256')
                    .setDescription('Cảnh báo mức TPS giao động từ dưới 8.')
                    .addFields(
                        { name: 'TPS trung bình', value: tpsAvg.toFixed(2) },
                        { name: 'Thời gian lag', value: hours + ' giờ ' + minutes + ' phút ' + seconds + ' giây'},
                        { name: 'TPS thấp nhất', value: minTps },
                    )
                    client.channels.cache.get('852158457624657941').send({embeds: [lagEmbed]});
                }
            }
        }
    }
}