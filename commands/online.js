const Discord = require("discord.js");
const mc = require("minecraft-protocol")

exports.run = (client, message, args) => {
	const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    if(command === "o" || command === "online") {
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
                
				const embed = new Discord.MessageEmbed()
							.setColor(0x000DFF)
							.setTitle('[Online Command]')
							.setDescription("Số người chơi trong server: **" + result.players.online + "**")
							.setFooter(footer)
							.setTimestamp();

				message.channel.send(embed).then(message => {
					message.delete({ timeout: 10000 });
				});
            }
        });

    }
			
}