// Discord modules
const Discord = require("discord.js");
const client = new Discord.Client();

var mineflayer = require('mineflayer')
var delay = require('delay')
var waitUntil = require('wait-until')

// Minecraft protocol
const mc = require("minecraft-protocol");

client.on('ready', () => {
	console.log('Bot online!');

	// create this bot
	createBot()
});

function createBot () {
	const bot = mineflayer.createBot({
		host: "2y2c.org",
		port: 25565,
		username: "0Channy",
		version: "1.12.2"
    }); // Start bot

    bot.on('login', () => {
      client.channels.cache.get("808903676873539614").send("Connected to the server.");
    })
    var one = false;
    bot.on('windowOpen', () => { // slot button mode cb
      if(one) return;
      one = true;
      setTimeout(() => {
        var random =  (Math.floor(Math.random("1") * Math.floor("9")) + 1) /*(Math.floor(Math.random("1") * 4)+ 5)*/ + " " +
                      (Math.floor(Math.random("1") * Math.floor("9")) + 1) + " " +
                      (Math.floor(Math.random("1") * Math.floor("9")) + 1) + " " +
                      (Math.floor(Math.random("1") * Math.floor("9")) + 1);

        console.log("try: " + random);
        
        if(random !== undefined) {
          client.channels.cache.get("808903676873539614").send("Try " + bot.username + " with " + random);
        }
        var pin1 = random.split(' ')[0]
        var pin2 = random.split(' ')[1]
        var pin3 = random.split(' ')[2]
        var pin4 = random.split(' ')[3]

        bot.clickWindow(pin1, 0, 0)
        delay(1000)
        bot.clickWindow(pin2, 0, 0)
        bot.clickWindow(pin3, 0, 0)
        bot.clickWindow(pin4, 0, 0)

        setTimeout(() => {
          one = false;
        }, 1*1000);
      }, 3*1000);

    });

    bot.on('title', function(title)  {
      console.log(title)
      if(title.includes("§c§lSai PIN")) {
        client.channels.cache.get("808903676873539614").send("Wrong PIN! Trying another.");
        console.log("wrong")
      }
      if(title.includes("§a§lWelcome")) {
        client.channels.cache.get("808903676873539614").send("Logged in to the server.");
        console.log("correct")
      }
    })

    bot.on('message', msg => {
      console.log(msg.toString())
      if(msg.toString().startsWith("Exception")
      || msg.toString() === "Kicked whilst connecting to auth: You have lost connection to the server") {
        bot.quit("error")
      }
    })

    var spawn = 0;
    bot.on('spawn', () => {
      console.log("spawn " + spawn)
      spawn++;
      console.log(bot.entity.position)
      var position = bot.entity.position;
      if(position === undefined) return;
      client.channels.cache.get("808903676873539614").send("I spawned at " + position);

      setTimeout(() => {
        if(spawn < 3) {
            bot.quit("dis")
        }
      }, 30*1000);
    });

    // bot.on('message', msg => {
    //   console.log(msg.toString())
    // })

    bot.on('kicked', (reason) => {
      console.log(reason)
      setTimeout(() => {

      }, 3*1000)
    })
    
    bot.on('end', () => {
      client.channels.cache.get("808903676873539614").send("I have kicked!");
      console.log("I have kicked")
      waitUntil(240000, 30, function condition() {
        client.channels.cache.get("808903676873539614").send("Trying to reconnect...");
				try {
					var today = new Date()
					let day = ("00" + today.getDate()).slice(-2)
					let month = ("00" + (today.getMonth() + 1)).slice(-2)
					let years = ("00" + today.getFullYear()).slice(-2)
					let hours = ("00" + today.getHours()).slice(-2)
					let min = ("00" + today.getMinutes()).slice(-2)
					var date = day + '.' + month + '.' + years + ' ' + hours + ':' + min
					console.log(date + " | Bot ended, attempting to reconnect... \n-----------------------------");
					
					createBot(); // reconnect
					
					return true;
				} catch (error) {
					console.log("Error: " + error);
					return false;
				}
			}, function done(result) {
				console.log("Completed: " + result);
			});
    })

}

client.login("ODA4OTA1MTUzNzYzMzQ0Mzg0.YCNVoQ.N5ZBxVzhTfL6ViNU4oEQUZ4C-MQ").catch(err => console.log(err));
client.on("error", (e) => { console.error(e) });