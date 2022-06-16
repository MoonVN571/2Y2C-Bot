const client = require('./index').client;
const guilds = require('./model/guilds-model');

// get channel global và đồng bộ sau 1 khoảng thời gian
async function sendLivechat(content) {
    if(content?.dev) return client.channels.cache.get("795135669868822528").send(content);
    client.guilds.cache.forEach(async g => {
        const db = new Database({path:'./data/guilds/setup' + g.id + '.json'});

        let channel = g.channels.cache.get(db.get('livechat'));
        if(!channel) return;

        channel.send(content).then(() => {

        }).catch(()=>{});
    });
}

function sendConnection(content) {
    if(content?.dev) return client.channels.cache.get("882849908892254230").send(content);
    client.guilds.cache.forEach(async g => {
        const db = new Database({path:'./data/guilds/setup' + g.id + '.json'});

        let channel = g.channels.cache.get(db.get('connection'));
        if(!channel) return;

        channel.send(content).catch(()=>{});
    });
}

function sendRestart(dev) {
    if(!dev) client.guilds.cache.forEach(async g => {
        const db = new Database({path:'./data/guilds/setup' + g.id + '.json'});

        let channel = g.channels.cache.get(db.get('restartChannel'));
        if(!channel) return;

        let role = g.roles.cache.get(db.get('restartRole'));
        if(!role) return;

        channel.send(`${role.toString()} [AutoRestart] Server Restarting!`).catch(()=>{});
    });
}

function sendError(error) {
    if(!error.message) return;
    console.log(error);
    client.channels.cache.get("886796482538266715").send(error.message);
}

function sendLog(data) {
    console.log(data);
    client.channels.cache.get("886800209399664640").send(`\`\`\`${data}\`\`\``);
}

module.exports = {
    sendLivechat,
    sendRestart,
    sendConnection,
    sendError,
    sendLog
}