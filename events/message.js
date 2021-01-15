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
    
    const bot = mineflayer.createBot({
      host: '2y2c.org',
      port: 25565,
      username: '2y2cBot',
      version: "1.12.2"
    });

    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;
  
    // Run the command
    cmd.run(client, message, args);
  };