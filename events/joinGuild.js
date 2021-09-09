const log = require('../log');
const api = require("../utils"); 

module.exports = {
	name: 'guildCreate',
	once: false,
	async execute(client, guild) {
        if(!guild.name) return;
		
        const verificationLevels = {
            "NONE": 'Không',
            "LOW": 'Thấp',
            "MEDIUM": 'Vừa phải',
            "HIGH": 'Cao',
            "VERY_HIGH": 'Cao nhất'
        };
		var owner = "Không rõ";
		
		await client.users.fetch(guild.ownerId).then(user => owner = user.tag + " (ID: " + guild.ownerId + ")");

		await client.channels.cache.get("878817216127201310").send({embeds: [{
			title: `Bot đã vào nhóm ${guild.name}`,
			description: "Một số thông tin:",
			fields: [
				{
					name: "Chủ server",
					value: owner,
					inline: true,
				},
				{
					name: "Ngày tạo nhóm",
					value: new Api().getTimestamp(guild.createdAt) + ` (tạo ${api.ageCalc(guild.createdAt, true)})`,
					inline: true
				},
				{
					name: "Cấp độ bảo mật",
					value: verificationLevels[guild.verificationLevel],
					inline: true
				},
				{
					name: "Tổng thành viên",
					value: (Intl.NumberFormat().format(guild.memberCount)).toString() + ` (${client.guilds.cache.get(guild.id).members.cache.map(user => user.user.bot).length} bots)`,
					inline: true
				},
				{
					name: "Tổng role",
					value: (Intl.NumberFormat().format(guild.roles.cache.size)).toString(),
					inline: true
				},
				{
					name: "Tổng kênh",
					value: (Intl.NumberFormat().format(guild.channels.cache.size)).toString(),
					inline: true
				}
			],
			color: client.config.DEF_COLOR,
			timestamp: new Date(),
			thumbnail: {
				url: guild.iconURL()
			},
			color: client.config.DEF_COLOR
		}]});
        console.log(guild.name + " joined");
        log(guild.name + " joined");
    }
};