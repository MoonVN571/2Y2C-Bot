var Scriptdb = require('script.db');

module.exports = {
    name: "marry",
    aliases: ['mry'],
    
    async execute(bot, username, args) {
        if(!bot.dev) return;
        // tinh nang
        /**
         * tu choi hon nhan
         * chap nhan hon nhan
         * huy bo hon nhan
         * kiem tra co vo hay chua
         * kiem tra da chap nhan
         */

        // set timeout mat dinh la 30s,
        if(!args[0]) {
            var coNy = new Scriptdb('./data/marry/' + username + ".json").get('married');

            if(coNy !== undefined) {
                var date = undefined;
                bot.whisper(username, "Đang yêu được " + date + ".")
            } else {
                bot.whisper(username, "Nhập tên người cần marry");
            }
        }

        // kiem tra dang ket hon
        var KiemTraKetHon = new Scriptdb(`./data/marry/${username}.json`);
        if(KiemTraKetHon.get('waiting')) return bot.whisper(username, "> Bạn đang chờ kết hôn.");

        // Kiem tra chu
        var KiemTraCoNy = new Scriptdb(`/data/marry/${args[0]}.json`);
        if(KiemTraCoNy.get('married') !== undefined) returnbot.chat(username + "," + args[0] + " đã có chủ");

        // ket hon
        var marry = new Scriptdb('./data/marry/' + args[0] + ".json");

        // kiem tra xem co marry voi ai chua
        if(marry.get('married') == undefined) { // chua co ny
            var list = Object.values(bot.players).map(p => p.username);

            // thong bao
            bot.chat(">" + username + " muốn cầu hôn với bạn, " + args[0] + ". Gõ \"yes\" để đồng ý và gõ \"no\" để từ chối. Bạn có 30 giây để ngỏ ý!")

            var checkAccept = new Scriptdb('./data/marry/' + args[0] + ".json");
            // ng se cho` marry la data chinh
            checkAccept.set('waiting', true); // đã ở chờ accept
            checkAccept.set('author', username) // người gọi marry

            if(list.includes(args[0])) {
                var a;
                a = setInterval(() => {                        
                    if(checkAccept.get('waiting')) { // kiem tra co dang cho ket hon k, tu ng kia
                        clearInterval(a);
                    } else {
                        clearInterval(a);
                        checkAccept.delete('author');
                    }
                }, 100);

                setTimeout(() => {
                    var a = new Scriptdb('./data/marry/' + args[0] + ".json");

                    var dakethon = a.get('married');
                    if(!checkAccept.get('waiting') || dakethon !== undefined) return;

                    checkAccept.delete('waiting');
                    checkAccept.delete('author');
                    bot.chat(`Hôn nhân của ${username} với ${args[0]} đã bị huỷ!`)
                    clearTimeout(a);
                }, 30 * 1000);
            } else {
                bot.chat("> Người chơi " + args[0] + " không hoạt động!");
            }
        } else {
            bot.chat("> " + args[0] + " đã có chủ.");
        }

    }
}