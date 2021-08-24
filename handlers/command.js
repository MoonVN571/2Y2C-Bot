const ascii = require('ascii-table');
let table = new ascii("Commands");

table.setHeading("Name", "Status");

const { readdirSync } = require('fs');

module.exports = (client) => {
    readdirSync('./commands/').forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
    
        commands.forEach((file) => {
            const pull = require(`../commands/${dir}/${file}`);
            
            if(pull.name) {
                table.addRow(pull.name, "✅");
                client.commands.set(pull.name, pull);
            } else {
                table.addRow(pull, "❌ -> Requires cmd.name");
                countinue;
            }
        });
    });

    console.log(table.toString());
}