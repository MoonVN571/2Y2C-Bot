const { readdirSync } = require('fs');

module.exports = client => {
    // Slash handler
    const arrayOfSlashCommands = [];

    readdirSync('./slashCommands/').forEach(dir => {
        const commands = readdirSync(`./slashCommands/${dir}/`).filter(file => file.endsWith('.js'));

        commands.forEach((file) => {
            const pull = require(`../slashCommands/${dir}/${file}`);

            if (pull.name) {
                client.slashCommands.set(pull.name, pull);
                arrayOfSlashCommands.push(pull);
            } else {
                console.log("Can not load " + file);
            }
        });
    });

    client.on("ready", async () => {
        await client.application.commands.set(arrayOfSlashCommands)
    });
}