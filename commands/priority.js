const Discord = require("discord.js");
const mc = require("minecraft-protocol")

exports.run = (client, message) => {
	const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    if(command === "q" || command === "queue") {
        mc.ping({"host": "2y2c.org"}, (err, result) =>{
            if(result) {
                try {
                    var players = [];
                    for(i = 0; result.players.sample.length > i; i++) {
                        players.push(result.players.sample[i].name);
                    }
                    var players2 = players.splice(0, Math.ceil(players.length / 2));
                    if (players == []) {
                        players.push(players2);
                        players2 = ".";
                    }
                } catch {
                    var players = 'unknown';
                    var players2 = 'unknown';
                }
                var old = players.toString().replace(",§6Cựu binh: §l0", "");
                var queue = old.toString().replace("§6Bình thường: §l", "");

                var prio = players2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");
                
                const embed = new Discord.MessageEmbed()
                                        .setColor(0x000DFF)
                                        .setTitle('[Priority Command]')
                                        .setDescription("Hàng chờ ưu tiên hiện tại: **" + prio + "**")
                                        .setFooter(client.footer)
                                        .setTimestamp();

                message.channel.send(embed).then(message => {
                    message.delete({ timeout: 10000 });
                });
            }
        });

    }
			
}