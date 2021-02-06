exports.run = (bot, username, message) => {
    // if(!args || args.length < 1) return message.reply("Must provide a command name to reload.");
    var splitMessage = message.split(' ');
    if(!splitMessage) {
        bot.whisper(username, "Bạn cần nhập tên cmd cần reload.")
        return;
    }
    const commandName = args[0];
    // Check if the command exists and is valid
    if(!client.commands.has(commandName)) {
      return bot.whisper(username, "Không tìm thấy cmd.")
    }
    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`./${commandName}.js`)];
    // We also need to delete and reload the command from the client.commands Enmap
    client.commands.delete(commandName);
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    message.reply(`The command ${commandName}.js has been reloaded`);
  };