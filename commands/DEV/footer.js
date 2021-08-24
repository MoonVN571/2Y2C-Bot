const Scriptdb = require('script.db');

module.exports = {
    name: "footer",
    dev: true,

    execute(client, message, args) {
        if(!args.length) return message.reply("Hãy nhập nội dung footer.");
    
        const data = new Scriptdb("./footer.json");

        let content = message.content.split(message.content.split(" ")[0] + " ")[1]

        data.set("text", content);

        message.reply("Đã set nội dung thành: \n```" + content + "```");
    }
}