const Api = require('../api');
const log = require('../log');

const Topgg = require('@top-gg/sdk')
const { AutoPoster } = require('topgg-autoposter')
const express = require('express')

const { Collection, Permissions } = require('discord.js');
const Scriptdb = require('script.db');

const { Client } = require('discord.js');

module.exports = {
	name: 'ready',
    once: true,
    /**
     * 
     * @param {Client} client 
     * @returns 
     */
    execute(client) {
        client.commands = new Collection();
        require('../handlers/command')(client);

        if(!client.dev) {
            const app = express()
            
            const webhook = new Topgg.Webhook(client.config.TOPGG_AUTH)
            
            AutoPoster(client.config.TOPGG_TOKEN, client).on('posted', () => console.log('Posted stats to Top.gg!'));
    
            app.post('/dblwebhook', webhook.listener(vote => {
                let data = new Scriptdb('./voted.json');
                

                if(!data.get(vote.user)) {
                    data.set(vote.user, Date.now())
                }

                client.channels.cache.get('862215076698128396').send({embeds: [{
                    description: "**<@" + vote.user + ">** đã vote bot!",
                    color: client.config.DEF_COLOR
                }]});
            }));

            app.listen(3000);
        }
    
        
        client.user.setActivity("RESTARTING", { type: 'PLAYING' });
        
        setTimeout(() => client.user.setActivity("Idling", { type: 'PLAYING' }), 10 * 1000);
    
        console.log('------------------------');
        console.log('       Moon Bot         ')
        console.log('------------------------');
        console.log('Guilds: ' + client.guilds.cache.size);
        console.log('Channels: ' + client.channels.cache.size);
        console.log('Total users: ' + client.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
        console.log('------------------------');
    
        console.log('Bot started!');
        console.log('Developer: ' + client.dev.toString().replace(/t/, "T").replace(/f/, "F"));
        
        log("Ready!");
        
        new Api().clean();
        
        // started notify
        client.guilds.cache.forEach((guild) => {
            const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
            const checkdata = data.get('livechat');
    
            if(checkdata == undefined || guild == undefined) return;
    
            if(client.dev) return;

            try {
                // client.channels.cache.get(guild.id).me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)

                if(!client.guilds.cache.get(guild.id).me.permissionsIn(client.channels.cache.get(checkdata)).has(Permissions.FLAGS.SEND_MESSAGES)) {
                    console.log(guild.id);
                    const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
                    if(err.toString().includes("Missing Permissions")) data.delete('livechat');
                    return;
                }

                client.channels.cache.get(checkdata).send({embeds: [{
                    description: "Đang khởi động lại bot.",
                    color: 0x15ff00
                }]}).catch(err => {
                    // const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
                    // if(err.toString().includes("Missing Permissions")) data.delete('livechat');
                    console.log(err);
                    console.log(guild.id);
                })
            } catch(e) {

            }
        });
    
        if(client.dev) return;
    
        // guild count
        client.channels.cache.get('856516410750664764').setName('Total Guilds: ' +  client.guilds.cache.size);
        client.channels.cache.get('856517492372668426').setName('Total Channels: ' +  client.channels.cache.size);
        client.channels.cache.get('856517721122406430').setName('Total Users: ' + client.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
        setInterval(() => {
            client.channels.cache.get('856516410750664764').setName('Total Guilds: ' +  client.guilds.cache.size);
            client.channels.cache.get('856517492372668426').setName('Total Channels: ' +  client.channels.cache.size);
            client.channels.cache.get('856517721122406430').setName('Total Users: ' +  client.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
        }, 30 * 60 * 1000);
    
        // restart since
        var today = new Date()
        let day = ("00" + today.getDate()).slice(-2)
        let month = ("00" + (today.getMonth() + 1)).slice(-2)
        let hours = ("00" + today.getHours()).slice(-2)
        let min = ("00" + today.getMinutes()).slice(-2)
    
        var date = hours + ':' + min + " " + day + '/' + month;
        client.channels.cache.get('856522329672515614').setName('Restart At: ' + date);
    }
}