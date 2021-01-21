const Discord = require("discord.js");

const config = require("./config.json");

const client = new Discord.Client();

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
		message.crosspost().catch((error) => {
			console.error(`Failed to crosspost message (${
				message.id
			}) in channel #${message.channel.name} (${message.channel.id}) ${
				message.guild
					? `of server ${message.guild.name} (${message.guild.id})`
					: ""
			}
			${error}`);

			const owner = client.users.resolve(message.guild.ownerID);
			if (owner) {
				const errorEmbed = new Discord.MessageEmbed()
					.setTitle("An error occured")
					.setColor("#f92921")
					.setDescription(
						`There was an issue publishing a message in <#${message.channel.id}>, make sure I have permissions to do so!`
					);
				owner.send(errorEmbed).catch((error) => {
					console.error(`Failed to send message to ${owner.tag} (${owner.id})
						${error}`);
				});
			}
		});
	}

	if (message.channel.type === "dm" && !message.author.bot) {
		const embed = new Discord.MessageEmbed()
			.setColor("#2ea1de")
			.setTitle("Information")
			.setDescription(
				`Autopublisher is a simple Discord bot that automatically publishes messages in announcement channels.
			
			[Source Code](https://github.com/nickhasoccured/autopublisher)`
			)
			.setThumbnail("https://i.imgur.com/ZMpfsAf.png")
			.addFields({
				name: "Common Issues",
				value: `If I'm not automatically publishing messages, make sure that
				**1)** I have permissions to manage & read messages in that channel
				**2)** The channel is an announcement channel
				If you're sure there's a problem, open an issue on this bot's [GitHub](https://github.com/nickhasoccured/autopublisher)`,
				inline: true,
			});
		message.channel.send(embed).catch((error) => {
			console.error(`Failed to send message in channel #${
				message.channel.name
			} (${message.channel.id}) ${
				message.guild
					? `of server ${message.guild.name} (${message.guild.id})`
					: ""
			}
			${error}`);
		});
	}
});

client.login(config.token);
