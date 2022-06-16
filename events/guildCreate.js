const log = require('../log');
const api = require("../utils"); 

module.exports = {
	name: 'guildCreate',
	once: false,
	async execute(client, guild) {
        if(!guild.name) return;

        console.log(guild.name + " joined");
        log(guild.name + " joined");
		
		var owner = "Không rõ";
		
		await client.users.fetch(guild.ownerId).then(user => owner = user.tag + " (ID: " + guild.ownerId + ")");

		await client.channels.cache.get("878817216127201310").send({embeds: [{
			title: `Bot đã vào nhóm ${guild.name}`,
			fields: [
				{
					name: "Chủ server",
					value: owner,
					inline: true,
				},
				{
					name: "Ngày tạo nhóm",
					value: api.getTimestamp(guild.createdAt) + ` (tạo ${api.ageCalc(guild.createdAt)} trước)`,
					inline: true
				},
				{
					name: "Tổng thành viên",
					value: (Intl.NumberFormat().format(guild.memberCount)).toString() + ` (${guild.members.cache.filter(member => member.user.bot).size} bots)`,
					inline: true
				},
			],
			color: client.config.DEF_COLOR,
			timestamp: new Date(),
			thumbnail: {
				url: guild.iconURL()
			},
			color: client.config.DEF_COLOR
		}]});
    }
};