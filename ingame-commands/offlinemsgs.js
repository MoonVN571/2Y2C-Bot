var Scriptdb = require('script.db')

module.exports = {
    name: "offlinemsgs",
    aliases: ['omsgs'],
    
    async execute(bot, username, args) {
        if(!args[0]) return bot.whisper(username, "> Nhập tên người cần nhắn khi họ online.");
        if(!args[1]) return bot.whisper(username, "> Bạn cần nhập nội dung để gửi tin nhắn.");

        if(args[0] == bot.username) return bot.whipser(username, "> Không thể đặt lời nhắn cho bot.");
        if(args[0] == username) return bot.whisper(username, "> Không thể gửi cho bản thân.");
        
        var msg = bot.logger.substr(logger.split(" ")[0].length + 1 + args[0].length + 1);

        var checkValidUser = new Scriptdb(`./data/joindate/${args[0]}.json`);

        if(checkValidUser == undefined) return bot.whisper(username, "> Bạn chắc rằng đã nhập đúng tên chứ ?");
        
        var data = new Scriptdb(`./offlinemsgs.json`);

        data.set(args[0] + '.author', username);
        data.set(username + '.' + args[0], msg);
        data.set(username +  '.' + args[0] + '.time', Date.now());

        bot.whisper(username, "Lời nhắn cho " + args[0] + " là: \"" + msg + "\". Nếu player đang online, lời nhắn sẽ được gửi trong lần tiếp theo.");
    }
}