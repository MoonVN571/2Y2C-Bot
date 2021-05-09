var request = require('request');

module.exports = {
    name: "2bqueue",
    description: "2bqueue command.",
    aliases: ['2bq', '2bqueue', "2bque"],
    
    async execute(bot, username, args) {
		request('https://api.2b2t.dev/prioq', function (error, response, body) {
			let datap = JSON.parse(body)[1];
			if(error) {
				datap = "Lỗi";
			}
			
			request('https://2b2t.io/api/queue?last=true', function (error, response, body) {
				let dataq = JSON.parse(body)[0][1];
				if(error) {
					dataq = "Lỗi";
				}
                bot.whisper(username, "> Hàng chờ 2B2T: " + dataq + " - Ưu tiên 2B2T: " + datap)
            });
        });
    }
}