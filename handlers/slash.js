const { readdirSync } = require('fs');

module.exports = client => {
    // Slash handler
    const arrayOfSlashCommands = [];

    readdirSync('./slashCOmmands/').forEach(dir => {
        const commands = readdirSync(`./slashCOmmands/${dir}/`).filter(file => file.endsWith('.js'));

        commands.forEach((file) => {
            const pull = require(`../slashCOmmands/${dir}/${file}`);

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