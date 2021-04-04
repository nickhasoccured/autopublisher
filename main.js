/*
Copyright (C) 2020-2021 Nicholas Christopher
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>
*/

console.log(`Starting AutoPublisher v${require("./package.json").version}...`);

const Discord = require("discord.js");

const config = require("./config.json");

const client = new Discord.Client();

const infoEmbed = new Discord.MessageEmbed()
	.setColor("#2ea1de")
	.setTitle("Information")
	.setDescription(
		`AutoPublisher is a simple Discord bot that automatically publishes messages in announcement channels.

[Source Code](https://github.com/nickhasoccured/autopublisher)`
	)
	.setThumbnail("https://i.imgur.com/ZMpfsAf.png")
	.addFields({
		name: "Common Issues",
		value: `If I'm not automatically publishing messages, make sure that:
**1)** I have permissions to manage & read messages in that channel.
**2)** The channel is an announcement channel.
If you're sure there's a problem, open an issue on this bot's [GitHub](https://github.com/nickhasoccured/autopublisher)`,
		inline: true,
	});

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
	client.user.setPresence({
		activity: {
			name: `${client.guilds.cache.size} servers!`,
			type: "WATCHING",
		},
	});

	setInterval(() => {
		client.user.setPresence({
			activity: {
				name: `${client.guilds.cache.size} servers!`,
				type: "WATCHING",
			},
		});
	}, 600000);
});

client.on("message", (message) => {
	if (message.channel.type === "news") {
		message.crosspost().catch(() => {
			const owner = client.users.resolve(message.guild.ownerID);
			if (owner) {
				const errorEmbed = new Discord.MessageEmbed()
					.setTitle("An error occurred")
					.setColor("#f92921")
					.setDescription(
						`There was an issue publishing a message in <#${message.channel.id}>, make sure I have permissions to do so!`
					);
				owner.send(errorEmbed).catch(() => {});
			}
		});
	}

	if (message.channel.type === "dm" && !message.author.bot) {
		message.channel.send(infoEmbed).catch(() => {});
	}
});

client.login(config.token);
