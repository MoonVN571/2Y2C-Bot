module.exports = {
    name: "invite",
    description: "invite command.",
    aliases: ['invites'],
    
    async execute(client, message, args) {
       message.channel.send("https://discord.com/api/oauth2/authorize?client_id=768448728125407242&permissions=8&scope=bot").then(msg => {
           msg.delete({ timeout: 10000 })
       })
    }
}