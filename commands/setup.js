module.exports = {
    name: "setup",
    description: "setup command.",
    aliases: [''],
    
    async execute(client, message, args) {
        if (!message.member.hasPermission('ADMINISRTATOR')) return message.channel.send("Không có quyền để dùng lệnh này.")

        var prefix = client.prefix;
        var Scriptdb = client.Scriptdb;
            
        /*
        if(!args[0]) return message.channel.send("Cách dùng: " + prefix + "setup chat <tag hoặc nhập id kênh>");
		
		if(!args[1]) return message.channel.send("Cách dùng: " + prefix + "setup <chat hoặc commands> <tag hoặc nhập id kênh>");

		if(args[0] === "chat") {
			var channel;
			channel = message.content.replace(/\D/g,'');
			if(channel === "") {
				channel = args[2];
			}

			// var guild = client.guilds.cache.map(guild => guild.id);
			// const data = new Scriptdb(`./data/guilds/setup-${guild}.json`);

            client.fs.readFile('channels.txt', 'utf8', function(err, data) {
                if(data == null) return;
                if(!data.includes(channel)) {
                    client.fs.appendFile('channels.txt', channel, function(err) { console.log(err) }) 

                    if(channel !== "NaN") {
                        message.channel.send("Bạn đã setup chat tại channel: " + channel.toString())
                    } else {
                        message.channel.send("Bạn đã setup chat tại channel: " + channel)
                    }
                } else {
                    return message.channel.send("Đã setup ròi. Cách xoá: " + prefix + "setup delete <chat hoặc stats, đã setup> <tag hoặc nhập kênh>")
                }
            })
        } */
        if(!args[0]) return message.channel.send("Cách dùng: " + prefix + "setup chat <tag hoặc nhập id kênh>");
        
        if(!args[1]) return message.channel.send("Cách dùng: " + prefix + "setup <chat hoặc stats> <tag hoặc nhập id kênh>");

        if(args[0] === "chat") {
            var channel;
            channel = message.content.replace(/\D/g,'');
            if(channel === "") {
                channel = args[2];
            }

            var guild = message.guild.id;
            const data = new Scriptdb(`./data/guilds/setup-${guild}.json`);
            const checkdata = data.get('livechat')
            
            if(checkdata == undefined) {
                data.set('livechat', channel); // nó sẽ ra 2 loại, 1 là id, 2 là tên channel đã setup
                if(channel !== "NaN") {
                    message.channel.send("Bạn đã setup chat tại channel: " + channel.toString())
                } else {
                    message.channel.send("Bạn đã setup chat tại channel: " + channel)
                }
            } else {
                if(args[1] == 'chat') {
                    message.channel.send("Đã setup ròi. Cách xoá: " + prefix + "setup delete chat <tag hoặc nhập id kênh>")
                } else {
                    message.channel.send("Đã setup ròi. Cách xoá: " + prefix + "setup delete <chat hoặc stats> <tag hoặc nhập id kênh>")
                }
            }
        }

        if(args[0] == 'stats') {
            if(!bot.dev) return;
            var channel;
            channel = message.content.replace(/\D/g,'');
            if(channel === "") {
                channel = args[2];
            }

            var guild = message.guild.id;
            const data = new Scriptdb(`./data/guilds/setup-${guild}.json`);
            const checkdata = data.get('livechat')
            
            if(checkdata == undefined) {
                data.set('stats', channel); // nó sẽ ra 2 loại, 1 là id, 2 là tên channel đã setup
                if(channel !== "NaN") {
                    message.channel.send("Bạn đã setup chat tại channel: " + channel.toString())
                } else {
                    message.channel.send("Bạn đã setup chat tại channel: " + channel)
                }
            } else {
                if(args[1] == "commands") {
                    message.channel.send("Đã setup ròi. Cách xoá: " + prefix + "setup delete stats <tag hoặc nhập kênh>")
                } else {
                    message.channel.send("Đã setup ròi. Cách xoá: " + prefix + "setup delete <chat hoặc stats> <tag hoặc nhập id kênh>")
                }
            }
        }
    }
}