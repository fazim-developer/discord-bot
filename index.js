const fs = require('fs');
const Discord = require('discord.js');
const { token, names, addressing, messages, emojies, prefix } = require('./config.json');
const prefixes = ['Phi ', 'phi ', 'PHI ', 'Phinixs ', 'phinixs ', 'PHINIXS '];

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
	
});

client.on('message', message => {

	let prefix = false;
	for(const thisPrefix of prefixes) {
	  if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
	}
	
	if (message.author.bot) return;
	//if (!message.content.startsWith(prefix) || message.author.bot) return;  //use only when strict only prefix chat with bot.

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}



});

//Newly Added touches//

client.on('message', message => {
	let prefix = false;
	for(const thisPrefix of prefixes) {
	  if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
	}
	if (message.content === `${prefix}how are you` || message.content === `${prefix}how you doing`) {
		message.reply(`I am fine, thanks for asking 😊.`);
	}
	if (message.content === `${prefix}what are you` || message.content === `${prefix}who are you` )  {
		message.reply(`I am regular old phinixs bot 😉.`);
	}
	if (message.content === `${prefix}thanks` || message.content === `${prefix}thank you` || message.content === `${prefix}thnx` )  {
		for(k = 0; k < emojies.length; k++){
			message.reply(`Your Welcome ${emojies[Math.floor(Math.random() * messages.length)]}.`);
			return;

		}
	}


});

//Normal Chat Sessions
client.on('message', message => {
    for (i = 0; i < addressing.length; i++) {
		if (message.content === `${addressing[i]}`) {
			message.reply(`${messages[Math.floor(Math.random() * messages.length)]}`);
		}
	}

});


//Calling Chat Sessions
client.on('message', message => {

    for (i = 0; i < addressing.length; i++) {
		for (j = 0; j< names.length; j++){
			if (message.content == `${addressing[i]} ${names[j]}`) {
				message.channel.send(`${messages[Math.floor(Math.random() * messages.length)]}`);
				message.channel.send('Type \`phi help\` or \`phinixs help\` in chat for help ');
				return;
			}
			if (message.content == `${names[j]}` ) {
				for(k = 0; k < emojies.length; k++){
					message.reply(`Yes ${emojies[Math.floor(Math.random() * messages.length)]}! \n Type \`phi help\` or \`phinixs help\` in chat for help `);
					return;

				}


			}

		}

	}
});









///GRETTING USERS///

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
	
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome')
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
	channel.send(`Hi ${member} Welcome to Phinixs server  🎉 , Type \`phi help\` or \`phinixs help\` in chat for help.`);
	
  });



client.login(token);
