var log = require('../log');
const api = require('../utils');
const Scriptdb = require('script.db');
module.exports = {
	name: 'guildDelete',
	once: false,
	async execute(client, guild) {
		if(!guild.name) return;
		var owner = "Không rõ";

		const db = new Scriptdb('./data/guilds/setup-' + guild.id + ".json");
		db.deleteAll();

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
					value: new Api().getTimestamp(guild.createdAt) + ` (tạo ${api.ageCalc(guild.createdAt, true)})`,
					inline: true
				},
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