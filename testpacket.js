// Discord modules
const Discord = require("discord.js");
const client = new Discord.Client();

// env files
const token = require('dotenv').config();
const config = {
	token: process.env.token, // Discord token
	ip: process.env.ip, // Server IP
};
var mineflayer = require('mineflayer')
var delay = require('delay')
// Minecraft protocol
const mc = require("minecraft-protocol");

client.on('ready', () => {
	console.log('Bot online!');

	// create this bot
	createBot()
});

function createBot () {
	const bot = mineflayer.createBot({
		host: config.ip,
		port: 25565,
		username: "mo0nbot2",
		version: "1.12.2"
    }); // Start bot
    bot.on('windowOpen', () => { // slot button mode cb

      bot.clickWindow(4, 0, 0)
      delay(1000)
      bot.clickWindow(3, 0, 0)
      bot.clickWindow(7, 0, 0)
      bot.clickWindow(1, 0, 0)
      
      bot.setQuickBarSlot(0)
      bot.activateItem()
    });
    var sending = false;
    var stats = false;
    bot.on('spawn', () => {
      setInterval(function() {
        if(stats) return;
        stats = true;
        // bot.chat('/stats');
        bot.swingArm("left");
        bot.look(Math.floor(Math.random() * Math.floor("360")), 0, true, null);
        antiAfk();
      }, 1*60*1000);
  
      function antiAfk() {
        setTimeout(function() {
          stats = false;
        }, 6*1000);
      }
  
    });
    bot.on("chat", (username, message, translate, jsonMsg, matches) => {
      console.log(username + ":" + message)
        if(jsonMsg.translate == 'chat.type.announcement' || jsonMsg.translate == 'chat.type.text') {
            var user = jsonMsg.with[0].text;
            var msg = jsonMsg.with[1];
            // if(username === client.username) return;
            console.log(user + ": " + msg)
          }
    })
}

client.login("NzY4NDQ4NzI4MTI1NDA3MjQy.X5AnpQ.CR2KnoF7inw0jDjqAiQcOMGck28").catch(err => console.log(err));
client.on("error", (e) => { console.error(e) });