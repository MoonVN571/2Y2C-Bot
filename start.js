const Discord = require("discord.js"),
      client = new Discord.Client(),
      fs = require("fs");

//Command Handler
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();

fs.readdir(`./commands/`, (error, files) => {
    if (error) {return console.log("Error while trying to get the commmands.");};
    files.forEach(file => {
        const command = require(`./commands/${file}`);
        const commandName = file.split(".")[0];

        client.commands.set(commandName, command);

        if (command.aliases) {
            command.aliases.forEach(alias => {
                client.aliases.set(alias, command);
            });
        };
    });
});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
    });
  });
  

client.on("ready", () => console.log("Online!"));
client.login("Njk5NjUxNjE1NjY5NjE2NzMz.XpXfWA.zNUjN8XK256zxTe-ShoQk45hG3A")