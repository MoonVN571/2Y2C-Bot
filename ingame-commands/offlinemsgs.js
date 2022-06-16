const Database = require('simplest.db');
module.exports = {
    name: "offlinemsgs",
    aliases: ['omsgs'],
    
    execute(bot, username, args) {
        if(!args[0]) return bot.whisper(username, "> Nhập tên người cần nhắn khi họ online.");
        if(!args[1]) return bot.whisper(username, "> Bạn cần nhập nội dung để gửi tin nhắn.");

        if(args[0] == bot.username) return bot.whisper(username, "> Không thể đặt lời nhắn cho bot.");
        if(args[0] == username) return bot.whisper(username, "> Không thể gửi cho bản thân.");
        
        var checkValidUser = new Database({path:`./data/joindate/${args[0]}.json`});
        if(checkValidUser == undefined) return bot.whisper(username, "> Bạn chắc rằng đã nhập đúng tên chứ ?");

        if(bot.logger.length > 70) return bot.whisper(username, "> Vượt quá giới hạn kí tự cho phép!")

        var data = new Database({path:`./offlinemsgs.json`});

        // Object của user sẽ nhận tn nếu user đó đã có trong data joindate
        let obj = {
            author: username,
            mesasge: args.slice(1).join(" "),
            time: Date.now()
        }

        data.array.push(args[0], obj);

        bot.whisper(username, "> Lời nhắn cho " + args[0] + " là: \"" + msg + "\".");
    }
}