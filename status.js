const { Client } = require('discord.js');
const client = new Client();

require('dotenv').config();

const config = {
	token: process.env.TOKEN,
}

client.login(config.token, (err) => console.log(err));

const request = require('request');
const mc = require('minecraft-protocol');

client.on('ready', () => {
    console.log("Bot loggedin with " + client.user.tag);
});

client.once('message', msg => {
    client.on('error', (err) => {
        console.log('err' + err.toString())
        console.log(msg.guild.id)
    });
})

client.on('message', message => {
    if(message.author.bot) return;
    let u = message.guild.members.cache.get(message.author.id);
    let role = message.guild.roles.cache.find(r => r.name == "Admin");

    // u.roles.add(role).catch(err => {});
    let c = client.channels.cache.get('a');
    if(!c) return;
    c.send("b").catch(err => {});

    try {
        // u.roles.add(role)
        client.channels.cache.get('a').send("b")
    } catch(e) {
        console.log(e.toString());
    }
});