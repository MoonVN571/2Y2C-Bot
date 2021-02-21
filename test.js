const Discord = require("discord.js");
const client = new Discord.Client();

const token = require('dotenv').config();
const config = {
	token: process.env.token, // Discord token
	ip: process.env.ip // Server IP
};

var mineflayer = require('mineflayer')

client.on('ready', () => {
	console.log('Bot online!');

	// create this bot
	createBot()
});

var defaultChannel = "812614734799962134";
var mc = require('minecraft-protocol')
function createBot() {
	const bot = mineflayer.createBot({
		host: "sv.heromc.net",
		port: 25565,
		username: "mo0nbot",
		version: "1.12.2"
	}); // Start bot
    
    bot.on('login', () => {
        setTimeout(() => {
            bot.chat('/l 123456789az')
        }, 3*1000)

        setTimeout(() => {
            bot.chat('/menu')
        }, 10*1000)
    });

    var main = false;
    var loai1 = false;
    var loai2 = false;
    bot.on('windowOpen', (window) => {
        console.log(window.title)
        var i = 0;
        if(window.title.toString().includes("§4§lChọn Máy Chủ §8§l♔")) {
            if(loai1) return;
            loai1 = true;

            i++;
            bot.clickWindow(13, 0, 0)
            setTimeout(() => {
                bot.closeWindow(window)
            }, 1*1000)
        }

        
        setTimeout(() => {
            if(loai2) return;
            loai2 = true;
            bot.setQuickBarSlot(0)
            bot.activateItem()
            setTimeout(() => {
                bot.clickWindow(21, 0, 0)
                main = true;
            }, 3*1000)
        }, 10 * 1000);
        // bot.chat()
    })

    bot.on('message', msg => {
        // console.log(msg.toString())
        
        var logger = msg.toString();
        
        var log;
        if(logger === "Connecting to server...") {
            log = logger;
        }

        if(logger ===  'Xin vui lòng đăng nhập bằng lệnh "/login <mật khẩu>"') {
            log = logger;
        }

        if(logger ===  'Đăng nhập thành công!') {
            log = logger;
        }

        if(logger == "Bạn đã đăng nhập!") {
            bot.chat('/l 123456789az')
        }

        if(logger.startsWith("Kết nối ")) {
            log = logger;
        }

        if(logger.startsWith("Could not connect to a default or fallback server")) {
            log = logger;
            bot.quit()
        }
        
        // return error message
        if (log !== undefined) {
            var embedNotf = new Discord.MessageEmbed()
                .setDescription(log)
                .setColor(0xb60000);

            client.channels.cache.get(defaultChannel).send(embedNotf);
            
        } 

        if(logger === null) return;
        var u = logger.split(" ")[1];
        var str = logger.split(" ")[0];
        if(u == undefined || str === undefined) return;
        var loggerformat = logger.substr(u.length + str.length + 2, logger.length);

        var username = logger.split(" ")[1];
        
        if(!main) return;
        if(!(logger.startsWith("[Member]"))) return;
        if(loggerformat == undefined) return;
        var embed = new Discord.MessageEmbed()
            .setDescription("**" + username + "** "+loggerformat)
            .setColor(0x979797);

        client.channels.cache.get(defaultChannel).send(embed);
            

    })

    client.on('disconnect', function (packet) {
        console.log('disconnected: ' + packet.reason)
    })

    bot.on('kicked', function(reason, loggedIn) {
		console.log(reason);
        console.log(loggedIn);
    });

    bot.on('end', () => {
        console.log("ended")

        createBot()
    })
}

client.login(config.token).catch(err => console.log(err));
client.on("error", (e) => { console.error(e) });