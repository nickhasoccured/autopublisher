const Discord = require("discord.js");

const config = require("./config.json");

const client = new Discord.Client({
	presence: {
		activity: {
			name: "@AutoPublisher",
			type: "WATCHING",
		},
	},
});

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}`);
});

client.on("guildCreate", (guild) => {
	console.log(`NEW GUILD: ${guild.name} (${guild.id})
	* ${guild.memberCount} members`);

	if (guild.partnered) {
		console.log("- This guild is PARTNERED");
	}

	if (guild.verified) {
		console.log("- This guild is VERIFIED");
	}
});

client.on("message", (message) => {
	if (message.channel.type === "news") {
		message.crosspost().catch((error) => {
			console.error(`Failed to crosspost message (${message.id}) in channel #${message.channel.name} (${message.channel.id}) of server ${message.guild.name} (${message.guild.id})
				* ${error}`);

			const owner = client.users.resolve(message.guild.ownerID);
			if (owner) {
				const errorEmbed = new Discord.MessageEmbed()
					.setTitle(`An error occured`)
					.setColor("#f92921")
					.setDescription(
						`There was an issue publishing a message in <#${message.channel.id}>, make sure I have permissions to do so!`
					);
				owner.send(errorEmbed).catch((error) => {
					console.error(`Failed to send message to ${owner.tag} (${owner.id})
						* ${error}`);
				});
			}
		});
	}

	if (
		message.mentions.has(client.user, {
			ignoreEveryone: true,
			ignoreRoles: true,
		})
	) {
		const embed = new Discord.MessageEmbed()
			.setColor("#2ea1de")
			.setTitle("Information")
			.setDescription(
				`Autopublisher is a simple Discord bot that automatically publishes messages in announcement channels.
			
			<:GitHub:771849320705556500> [**SOURCE CODE**](https://github.com/nickhasoccured/autopublisher)`
			)
			.setThumbnail("https://i.imgur.com/ZMpfsAf.png")
			.addFields({
				name: `Common Issues`,
				value: `If I'm not automatically publishing messages, make sure that
				**1)** I have permissions to manage & read messages in that channel
				**2)** The channel is an announcement channel
				If you're sure there's a problem, open an issue on this bot's [GitHub](https://github.com/nickhasoccured/autopublisher)`,
				inline: true,
			});
		message.channel.send(embed).catch((error) => {
			console.error(`Failed to send message in channel #${message.channel.name} (${message.channel.id}) of server ${message.guild.name} (${message.guild.id})
				* ${error}`);
		});
	}
});

client.login(config.token);
