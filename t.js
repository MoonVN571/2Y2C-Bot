var mineflayer = require('mineflayer');
var waitUntil = require('wait-until');

require('dotenv').config();

var config = {
    PIN: process.env.PIN
}

// call function tạo bot
createBot();

function createBot() {
	const bot = mineflayer.createBot({
		host: '2y2c.org',
		port: 25565,
		username: "MoonShopBot",
		version: "1.16.4"
	});

    bot.on('windowOpen', () => { 
        bot.clickWindow(config.PIN.split(" ")[0], 0, 0)
        bot.clickWindow(config.PIN.split(" ")[1], 0, 0)
        bot.clickWindow(config.PIN.split(" ")[2], 0, 0)
        bot.clickWindow(config.PIN.split(" ")[3], 0, 0)
        
        setTimeout(() => { bot.chat('/2y2c') }, 10*1000)
    
        setTimeout(() => { bot.clickWindow(10,0,0); }, 12*1000);
    })

    bot.on('message', msg => {
        if (!(msg.toString().startsWith("<"))) return;

		var username = msg.toString().split(" ")[0].split("<")[1].split(">")[0];
	
		if(username.startsWith("[")) {
			username = username.split("]")[1];
		}
	
		logger = msg.toString().substr(msg.toString().split(" ")[0].length + 1);
	
		if(logger.includes("bán kit") || logger.includes("bán kit ko") || logger.includes("ban kit") || logger.includes('sell kit')) {
			bot.whisper(username, "> Moon Shop: https://discord.gg/5Nh3tZB8nc");
		}
    })

    bot.once('login', () => {
        // Check khi bot được connect vào server
        bot.once('spawn', () => {
            console.log("Bot đã kết nối vào server!");

            var array = ['Hiện tại shop đã có hệ thống điểm để quy đổi! Ghé thăm Shop: https://bit.ly/2T0viv để biết thêm chi tiết.',
                        'Ở đây có bán kit, nitro, acc minecraft! Link Shop: mhttps://bit.ly/2T0viv.',
                        'Bạn có thể ghé thăm Moon Shop để xem và tốt hơn nữa thì hãy mua! Link: https://bit.ly/2T0viv.',
                        'Đặt hàng và thanh toán, nhận hàng ở toạ độ shop đưa. Chỉ có tại Moon Shop: https://bit.ly/2T0viv.']
            
            var i = 0;
            setInterval(() => {
                i++;
                if(i > array.length + 1) {
                    i = 0;
                }
                
                bot.chat(array[i]);
            },  5 * 60 * 1000);

            setInterval(() => {
                bot.swingArm("left");
                bot.look(Math.floor(Math.random() * Math.floor("360")), 0, true, null);
            }, 1 * 60 * 1000);
        });
    })

    bot.on('end', () => {
        console.log("Bot đã mất kết nối server!");

        // Số giây để bot kết nối lại vào server
        var reconnectInSecond = 60;

        waitUntil(reconnectInSecond * 1000, 50, function condition() {
            try {
                console.log("Reconnecting to the server.");
                createBot()
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