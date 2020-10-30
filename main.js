// Require Discord and make a new client
const Discord = require('discord.js');
const client = new Discord.Client();

// Require config
const config = require('./config.json');

// Set activity
client.once('ready', () => {
	console.log('Online');
	client.user.setActivity(`news channels`, { type: 'WATCHING' })
});

client.on('message', message => {
  if (message.channel.type === 'news') {
    message.crosspost()
      .catch(console.error);
  };

  if (message.mentions.has(client.user)) {
    const embed = new Discord.MessageEmbed()
			.setColor('#2ea1de')
			.setTitle('Information')
			.setDescription(`Autopublisher is a simple Discord bot that automatically publishes messages in announcement channels.\n\n<:GitHub:771849320705556500> [**SOURCE CODE**](https://github.com/nickpdx/autopublisher)`)
      .setThumbnail('https://i.imgur.com/ZMpfsAf.png')
			.addFields(
				{ name: `Common Issues`, value: `If I'm not automatically publishing messages, make sure that\n**1)** I have permissions to manage & read messages in that channel\n**2)** The channel is an announcement channel\nIf you're sure there's a problem, open an issue on this bot's [GitHub](https://github.com/nickpdx/autopublisher)`, inline: true },
			)
		message.channel.send(embed);
  };

});

client.login(config.token);
