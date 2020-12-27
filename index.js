// 2Y2C

const Discord = require("discord.js");
const client = new Discord.Client();

const mc = require("minecraft-protocol");

const token = require('dotenv').config();

const config = {
  token: process.env.token
};

const prefix = "$";

// Construct
const footer = "Dev by Moonz#0001";

const cancelexecute = new Discord.RichEmbed()
            .setTitle(`[Warning]`)
            .setDescription(`Bạn không được phép sử dụng.`)
            .setColor('#336EFF')
            .setFooter(footer)
            .setTimestamp(); // Cancelled embed

var anUser = client.users.cache.get("Moonz#0001"); // Check user is in ()

// Date
var currentdate = new Date();
var datetime =    currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

if(!config.token) {
    console.log('No token set!')
    setTimeout(function(){
        process.exit(1)
    }, 5000);
} else {
    startDiscord(token);
}


function startDiscord(token){
  client.on('ready', () => {

  		console.log('Bot online!');
  		client.user.setPresence({
    		status: "online",
    		game: {
    		name: "RESTARTING",
    		type: "PLAYING"
    		}
  		});
	});

  client.on("message", message => {

      if(message.author == client.user) return;

        // Forked from mconline_discord_bot
        mc.ping({"host": "2y2c.org"}, (err, result) =>{
            if(err) {
  					  client.user.setPresence({
    					  status: "dnd",
    					  game: {
    						name: "Hosting is offline!",
    						type: "PLAYING"
    					  }
  					  });
            }

            // Check if host has result
            if(result) {
        		try {
        			var players = [];
        			for(i=0;result.players.sample.length > i; i++) {
        				players.push(result.players.sample[i].name);
        			}
        			var players2 = players.splice(0, Math.ceil(players.length / 2));
        			if (players == []) {
        				players.push(players2);
        				players2 = ".";
        			}
        		} catch {
        			var players = '.';
        			var players2 = '.';
        		}

                // Variable
      			var replacestring = players;
      	    	var replacestring2 = players2;

                // Replace
        		var queue = replacestring.toString().replace("§6Bình thường: §l", "");
        		var prio = replacestring2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");

                // Check if server is offline
                if(prio === ".") {
                  client.user.setPresence({
                    status: "idle",
                    game: {
                    name: "Server is Offline! Maybe",
                    type: "PLAYING"
                    }
                  });
                } else if(queue === ".") {
                  client.user.setPresence({
                    status: "idle",
                    game: {
                    name: "Server is Offline! Maybe",
                    type: "PLAYING"
                    }
                  });
                }

                // Do it, set status of bot
      		    client.user.setPresence({
        		    status: "dnd",
        		    game: {
        		    name: "Queue: " + queue + " - Prio: " + prio + ` - Online: ${result.players.online}`,
        		    type: "PlAYING"
        		    }
      		    });

                // Queue command
                if(message.content === prefix + "$queue") {

                console.log("Queue: " + queue + " - Prio: " + prio + " - Type: Command - Last synced: " + datetime);

                const embed = new Discord.RichEmbed()
                            .setColor(0x000DFF)
                            .setTitle('[Minecraft Status Command]')
                            .setDescription("Queue: " + queue + " - Priority: " + prio + ` - Online: ${result.players.online}`)
                            .setFooter(footer)
                            .setTimestamp();
                message.channel.send(embed).then(message => {
                    message.delete(10000);
                });

                }

          }
                // Help command
                if(message.content === prefix + "help") {

                    const embed = new Discord.RichEmbed()
                                .setColor(0x000DFF)
                                .setTitle('[Help Command]')
                                .addField("*[Help Command]*", prefix + 'help', false)
                                .addField("*[Minecraft Status Command]*", prefix + 'queue', false)
                                .addField("*[Update Command]*", prefix + 'update', false)
                                .setFooter(footer)
                                .setTimestamp();

                    message.channel.send(embed).then(message => {
                        message.delete(10000);
                    });

                }

                // On bot ping
                if(message.isMentioned(client.user)) {

                    const embed = new Discord.RichEmbed()
                                .setColor(0x000DFF)
                                .setTitle('[Bot Command]')
                                .setDescription('Prefix mặc định của bot là ' + prefix)
                                .setFooter(footer)
                                .setTimestamp();

                    message.channel.send(embed).then(message => {
                        message.delete(10000);
                    });
                }

                // Update command
                if (message.content === prefix + "update") {

                    // Check users
                    if(anUser) return message.channel.send(cancelexecute)

                    const embed = new Discord.RichEmbed()
                                .setColor(0x000DFF)
                                .setTitle('[Update Command]')
                                .setDescription("Updated the bot!")
                                .setFooter(footer)
                                .setTimestamp()
                    setTimeout(function(){
                        message.delete();
                    }, 10000);

                    message.channel.send(embed).then(message => {
                    message.delete(10000);
                    });

                }



      });

    });

    // Login with token
    client.login(config.token).catch(err => console.log(err));

}
