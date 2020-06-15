const Discord = require("discord.js");
module.exports = {
	name: 'user-info',
	description: 'Display info about yourself.',
	execute(message) {
		//message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
		if (!message.mentions.users.size) {
			const exampleEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle(message.author.username)
			.setDescription('User id: ' + message.author.id)
			.setAuthor('👀 User info')
			.setFooter("Since " + message.author.createdAt)
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
			return message.channel.send(exampleEmbed);
		}

		const avatarList = message.mentions.users.map(user => {
			const exampleEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle(user.username)
			.setDescription('User id: ' + user.id)
			.setAuthor('👀 User info')
			.setFooter("Since " + user.createdAt)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }));
			return message.channel.send(exampleEmbed);
		});

		message.channel.send(avatarList);
	},
};
