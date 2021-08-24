const ascii = require('ascii-table');
let table = new ascii("Commands");

table.setHeading("Name", "Status");

const { readdirSync } = require('fs');

const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));

module.exports = client => {
    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
            
        if(event.name) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(client, ...args));
            } else {
                client.on(event.name, (...args) => event.execute(client, ...args));
            }
            table.addRow(file, "✅");
        } else {
            table.addRow(file, "❌ -> Requires event.name");
            continue;
        }
    }
    console.log(table.toString());
}