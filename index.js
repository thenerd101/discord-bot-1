const fs = require('fs');
const DisTube = require('distube');
const Discord = require('discord.js');
const discordprefix = require('discord-prefix');
const Eris = require("eris-additions")(require("eris"));
const keepAlive = require('./server.js');
const { defaultprefix } = require('./config.json')
require('dotenv').config();





function getUserFromMention(mention) {
	// The id is the first and only match found by the RegEx.
	const matches = mention.match(/^<@!?(\d+)>$/);

	// If supplied variable was not a mention, matches will be null instead of an array.
	if (!matches) return;

	// However, the first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];

	return client.users.cache.get(id);
}



const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.aliases = new Discord.Collection();

//MongoDB Variables
const { MongoClient } = require("mongodb");
const mongo = new MongoClient(process.env.MONGOURL, { useUnifiedTopology: true, useNewUrlParser: true })


//Mongo Connect
mongo.connect((err) => {
    if(err) throw err;
    console.log("Connection to MongoDB database established successfully!");
});




//commandFiles
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name || command.help.name, command);
}

let thedefaultPrefix = defaultprefix;

// Create a new DisTube
client.distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: true })
// DisTube event listeners, more in the documentation page
client.distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
    ))
	.on("addSong", (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ))
	// DisTubeOptions.searchSongs = true
	.on('searchResult', (message, result) => {
		let i = 0
		message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join('\n')}\n*Enter anything else or wait 60 seconds to cancel*`)
	})
	.on('error', (message, error) => {
		message.channel.send(`An error encountered: ${error}`)
	})





	
client.on('message', async message => {
	const db = mongo.db("Bot1");


	if (!message.guild) return;

	//get the prefix for the discord server
	let prefix = discordprefix.getPrefix(message.guild.id);

	//set prefix to the default prefix if there isn't one
	if (!prefix) prefix = thedefaultPrefix;


	if (!message.content.startsWith(prefix) || message.author.bot) return;



	if (!message.guild) {
		return;
	} else console.log(prefix)

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;


	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('You can not do this!');
		}
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	const { cooldowns } = client;

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
		let cmd = client.commands.get(command);

		command.run(client, message, args, prefix, db);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});




//Connect client
client.on('ready', () => {
	client.user.setActivity(`some cool dang (20+) servers!`, { type: 'LISTENING' });
    console.log(`${client.user.tag} is online!`);
});

keepAlive();

client.login(process.env.TOKEN);