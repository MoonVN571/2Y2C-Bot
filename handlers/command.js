const { readdirSync } = require('fs');

module.exports = (client) => {
    readdirSync('./commands/').forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
    
        commands.forEach((file) => {
            const pull = require(`../commands/${dir}/${file}`);
            
            if(pull.name) {
                client.commands.set(pull.name, pull);
            } else {
                console.log(pull, " -> Requires cmd.name");
            }
        });
    });
}