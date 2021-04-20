var Discord = require('discord.js')
var client = new Discord.Client();
require('dotenv');

client.login("NzY4NDQ4NzI4MTI1NDA3MjQy.X5AnpQ.CR2KnoF7inw0jDjqAiQcOMGck28")

client.on('ready', () => {
    console.log(client.guilds.cache.map(guild => guild.name))
})