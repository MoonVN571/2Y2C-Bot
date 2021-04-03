module.exports = {
    name: "2bqueue",
    description: "2bqueue command.",
    aliases: ['2bq', '2bqueue', "2bque"],
    
    async execute(bot, username, args) {
        bot.superagent.get("https://2b2t.io/api/queue?last=true").end((err, data) => {
            let queue = data.body[0][1];
            if(err) {
                queue = "Lỗi";
            }

            bot.superagent.get("https://api.2b2t.dev/prioq").end((err, dataq) => {
                let prio = dataq.body[1];	
                if(err) {
                    prio = "Lỗi";
                }
                bot.whisper(username, "> Hàng chờ 2B2T: " + queue + " - Ưu tiên 2B2T: " + prio)
            });
        });
    }
}