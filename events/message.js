var db = require('quick.db');

module.exports = (client, message) => {
    // Ignore all bots
    if (message.author.bot) return;

    // Ignore messages not starting with the prefix (in config.json)
    if (message.content.indexOf(client.config.prefix) !== 0) return;
  
    // Our standard argument/command name definition.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);

    var mineflayer = require('mineflayer')
    var tpsPlugin = require('mineflayer-tps')(mineflayer)

    const footer = "2Y2C Bot 2021";
    const defaultChannel = '795135669868822528';
    
    var usernamename;
    var logger;

    const bot = mineflayer.createBot({
      host: '2y2c.org',
      port: 25565,
      username: '2y2cBot',
      version: "1.12.2"
    });

    bot.loadPlugin(tpsPlugin);

    bot.on('chat', function(username, logger) {
      username = username;
      logger = logger;

      	// hide suicide, broadcast
        if(username === "2Y2C" || username === "Broadcast") return;
        if(username === "whispers") return;
        
        // Waiting for chat
        if(username === "CS") { /*
          color = "0xFF5A00";
          var second = logger.replace(/Wait/, "")
          var second2 = second.replace(/before sending another message!/, "")
          const joined = new Discord.MessageEmbed()
                  .setDescription(`Cần chờ ${second2} để lập lại từ đó.`)
                  .setColor(color);
          try {
            client.channels.cache.get(defaultChannel).send(joined);
          } catch(e) {
          
          }
          return;
        } else {
          // return default color
          color = "0x979797";
          */
          return;
        }

        // cancel similar chat
        if(username === "similar" || logger === "message.") return;
        
        // anti afk
        if(username === "Name"
        || username === "Kills"
        || username === "Deaths"
        || username === "Ratio"
        || username === "Streak"
        || username === "Elo") return;
        
        // auth kick
        if(username === "auth") return;

        if(logger === "Control passed.") {

          setInterval(function() {
            bot.chat('/stats');
            console.log('stats')
          }, 180000);
          
          const joined = new Discord.MessageEmbed()
                  .setDescription(`**Bot joined the main server!**`)
                  .setColor("FFFB00");

          // joining wile see UUID
          try {
            client.channels.cache.get(defaultChannel).send(joined);
          } catch(e) {
          
          }
        }

        // Phải để sau
        if(username === "UUID") return;
        
        // return 1 cái gì đó thông báo
        if(username === "c") return;
        
        if(username === "ReadTimeoutException") return;

        // restarts
        if(logger === "Server sẽ Restart sau 15 phút!")
          return client.channels.cache.get('795534684967665695').send("@everyone Server sẽ Restart sau 15 phút!");
        if(logger === "Server sẽ Restart sau 5 phút!")
          return client.channels.cache.get('795534684967665695').send("@everyone Server sẽ Restart sau 5 phút!");
        
        if(logger === "Server Restarting!") return client.channels.cache.get('795534684967665695').send("@everyone Server Restarting!");
        if(username === "AutoRestart") return;
        
        // check > msg
        if(logger.startsWith(">")) {
          color = "0x56FF00";
        }
        
        // Command whisper
        if(logger === "Bạn đã chat với bot. Tham gia: discord.gg/yrNvvkqp6w"
        || logger === "Bạn sẽ chờ ít nhất 20 giây để bot tính toán tps chính xác."
        || logger === "Bạn có thể ghé thăm shop server: discord.gg/nzm2SnDBGX (Revolution Shop)"
        || logger === 'Link server discord: dicord.gg/yrNvvkqp6w'
        || logger === "Một số lệnh bạn có thể sử dụng: !discord, !buykit,... Xem đầy đủ lệnh tại: dicord.gg/yrNvvkqp6w"
        || logger.includes('Hàng chờ bình thường hiện tại')
        || logger.includes('Hàng chờ ưu tiên hiện tại')
        || logger.includes('Bạn đã nhận được')
        || logger.includes('Server TPS:')
        || logger.includes('Máu:')) {
          color = "0xFD00FF";
        }

        var dauhuyen = logger.toString().replace("`", "\`");
        var newLogger = dauhuyen.replace("_", "\_");
      
        var newUsername = username.toString().replace("_", "\_");
      
        var today = new Date()
        let day = ("00" +today.getDate()).slice(-2)
        let month = ("00" +(today.getMonth()+1)).slice(-2)
        let years = ("00" + today.getFullYear()).slice(-2)
        let hours = ("00" + today.getHours()).slice(-2)
        let min = ("00" + today.getMinutes()).slice(-2)
        var date = day +'.'+month+'.'+years+' ' + hours + ':' + min

        // embed chat
        var chat = new Discord.MessageEmbed()
              .setDescription('`' + date + '` '+ `**${newUsername}:**  ${newLogger}`)
              .setColor(color);
        try {
          client.channels.cache.get(defaultChannel).send(chat);
            color = "0x979797";

        } catch(e) {
        
        }
        });

    bot.on('whisper', (username, message, rawMessage) => {
      var newUsername = username.toString().replace("_", "\_");
      // Time
      var today = new Date()
      let day = ("00" +today.getDate()).slice(-2)
      let month = ("00" +(today.getMonth()+1)).slice(-2)
      let years = ("00" + today.getFullYear()).slice(-2)
      let hours = ("00" + today.getHours()).slice(-2)
      let min = ("00" + today.getMinutes()).slice(-2)
      let sec = ("00" + today.getSeconds()).slice(-2)
      var date = day +'/'+month+'/'+years+' ' + hours + ':' + min;
  
      console.log(`I received a message from ${newUsername}: ${message} (${date})`)
      bot.whisper(username, 'Bạn đã chat với bot. Tham gia: discord.gg/yrNvvkqp6w')
  
    });

    bot.on("login", () => {
      const joined = new Discord.MessageEmbed()
          .setDescription(`**Bot joined the server!**`)
          .setColor("FFFB00");
  
      try {
        client.channels.cache.get(defaultChannel).send(joined);
      } catch(e) {
      
      }
    });

    bot.on('windowOpen', () => { // slot button mode cb
      console.log('Window open')
      bot.clickWindow(8,0,0)
      delay(1000)
      bot.clickWindow(7,0,0)
      bot.clickWindow(2,0,0)
      bot.clickWindow(6,0,0)
    });
  
    bot.on('spawn', () => {
  
      /*
      setInterval(function() {
        chat();
        function chat() {
          bot.chat('> Chat với server tại discord: https://discord.gg/yrNvvkqp6w')
        }
      }, 300000);
  
      setInterval(function() {
        ads()
        function ads() {
          bot.chat('> Bạn muốn luyện pvp crystal? Tham gia: 2y2cpvp.sytes.net')
        }
      }, 600000);
  
      setInterval(function() {
        prioqueue()
        function prioqueue() {
          bot.chat('> Bạn có thể xem hàng chờ bằng lệnh !queue hoặc hàng chờ ưu tiên với lệnh !prio')
        }
      }, 900000);
      
      setInterval(function() {
        ping()
        function ping() {
          bot.chat('> Xem ping của bạn: !ping')
        }
      }, 1200000);
      
      setInterval(function() {
        restart()
        function restart() {
          bot.chat('> Thông báo server restart tại: discord.gg/yrNvvkqp6w')
        }
      }, 1500000);
      
      setInterval(function() {
        buykit()
        function buykit() {
          bot.chat('> Bạn muốn mua kit dùng: !buykit')
        }
      }, 1800000);
      
      setInterval(function() {
        coords()
        function coords() {
          bot.chat('> Xem toạ độ của bot: !coords')
        }
      }, 2100000);
  
      setInterval(function() {
        coords()
        function coords() {
          bot.chat('> Xem số ngày của world server: !time')
        }
      }, 2400000);
  
      setInterval(function() {
        notf()
        function notf() {
          bot.chat('> Nếu bạn dùng lệnh mà không thấy bot trả lời, có thể bạn đã chat quá nhanh./ Lưu ý')
        }
      }, 2700000); */
      
    });

    bot.on('message', message => {
      var logger = message.toString()
      try {
        client.channels.cache.get('797426761142632450').send(logger);
      } catch(e) { 
      
      }
  
      // basic check
      if(logger === undefined) return;
      if(logger.includes(':')) return;
      
      var name;
      var type;
      let data = db.get(`${name}_${type}`);
        
      if(data === null) {
        db.set(`${name}_${type}`, 1)
      } else {
        db.add(`${name}_${type}`, 1)
      }
      
      // kill
      if(logger.includes('bị bắn chết bởi')) {
        var str = logger;
        var string = str.split(" ")[0];
        var user = str.substring('5', string);
        
        name = user;
        type = 'kills';
  
      } else if (logger.includes('nhảy con mẹ nó vào lava khi bị truy sát bởi')) {
        var str = logger;
        var string = str.split(" ")[0];
        var user = str.substring('12', string);
        
        name = user;
        type = 'kills';
        
      } else if(logger.includes('nổ banh xác bởi')) {
        var str = logger;
        var string = str.split(" ")[0];
        var user = str.substring('5', string);
        
        name = user;
        type = 'kills';
  
      }
  
      // deaths
      if(logger.includes('Té')
      || logger.includes('chợt')
      || logger.includes('đã')
      || logger.includes('đéo')
      || logger.includes('bị')
      || logger.includes('chạy')
      || logger.includes('nổ')
      || logger.includes('đấm')
      || logger.includes('nhảy')
      || logger.includes('cháy')
      || logger.includes('bay')) {
        var user = logger.split(" ")[0];
  
        name = user;
        type = 'dead';
      }
    })

    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;
  
    // Run the command
    cmd.run2(client, message, args);
    cmd.run(bot, name, logger);
  };