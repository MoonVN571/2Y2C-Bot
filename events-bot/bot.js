const mc = require("minecraft-protocol")

module.exports = (mineflayer) => {

    // minecraft bot uptime
	var minutes;
	var seconds;
	var hours;
	var totalSeconds = 0;
	function setTime() {
		++totalSeconds;
		seconds = pad(totalSeconds % 60);
		minutes = pad(parseInt(totalSeconds / 60));
		hourss = parseInt(minutes / 60);
		if(hours === "NaH") {
			hours = "0";
		} else if (minutes === "NaH") {
			minutes = "0";
		}
	}

	function pad(val) {
	  var valString = val + "";
	  if (valString.length < 2) {
		return "0" + valString;
	  } else {
		return valString;
	  }
    }
    
	var bot = mineflayer.createBot({
		host: config.ip,
		port: 25565,
		username: "2y2cBot3",
		version: "1.12.2"
    }); // Start bot
    
    bot.on('windowOpen', () => { // slot button mode cb
		if(dev) {
			console.log('Window open')
		}

		bot.clickWindow(4, 0, 0)
		delay(1000)
		bot.clickWindow(3, 0, 0)
		bot.clickWindow(7, 0, 0)
		bot.clickWindow(1, 0, 0)
    });
    
	// while connect to the server
	bot.on('login', () => {
		// uptime method
		setInterval(setTime, 1000)
		totalSeconds = 0;

		setInterval(function() {
			mc.ping({"host": config.ip}, (err, result) =>{
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
					var status = "Queue: " + queue + " - Prio: " + prio + " - TPS: " + bot.getTps() + " - Online: " + result.players.online + " - Đã tham gia server từ " + hourss + " tiếng trước.";

					try {
						client.channels.cache.get(defaultChannel).setTopic(status)
					} catch (e) {
						if(!dev) return;
						console.log("SET TOPIC ERROR", e)
					}
				}
			})
        }, 10*60*1000);
    })
}