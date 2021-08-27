var log = require('../log');

module.exports = {
	name: 'guildDelete',
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
			title: guild.name,
			description: "Bot đã thoát khỏi nhóm!",
			fields: [
				{
					name: "Chủ server",
					value: owner,
					inline: true,
				},
				{
					name: "Ngày tạo nhóm",
					value: new Api().getTimestamp(guild.createdAt) + ` (tạo ${new Api().ageCalc(guild.createdAt, true)})`,
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
			timestamp: new Date(),
			color: client.config.DEF_COLOR,
			thumbnail: {
				url: guild.iconURL()
			},
			color: client.config.DEF_COLOR
		}]});
		console.log(guild.name + " left");
        log(guild.name + " left");
    }
};