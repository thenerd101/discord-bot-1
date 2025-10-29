const fs = require('fs');
const path = require('path');

const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { DirectLinkPlugin } = require('@distube/direct-link');
const { BandlabPlugin } = require('@distube/bandlab');

const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, ActivityType, ChannelType } = require('discord.js');
const keepAlive = require('./server.js');
const mongoose = require('mongoose')
const { defaultprefix } = require('./config.json')
require('dotenv').config();

//const ffmpegStatic = require('ffmpeg-static');
//process.env.PATH = `${path.dirname(ffmpegStatic)};${process.env.PATH}`;

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

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,

        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildExpressions,
        GatewayIntentBits.DirectMessageTyping
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
client.commands = new Collection();
client.cooldowns = new Collection();
client.aliases = new Collection();

//MongoDB Variables
const { MongoClient } = require("mongodb");
const mongo = new MongoClient(process.env.MONGOURL, { useUnifiedTopology: true, useNewUrlParser: true })

//Mongo Connect
mongo.connect((err) => {
    if(err) throw err;
    console.log("Connection to MongoDB database established successfully!");
});
mongoose.connect(process.env.MONGOURL, { useUnifiedTopology: true, useNewUrlParser: true});

//commandFiles
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

let thedefaultPrefix = defaultprefix;

// Create a new DisTube

client.distube = new DisTube(client, {
	emitNewSongOnly: true,
    joinNewVoiceChannel: true,
    emitAddSongWhenCreatingQueue: true,
    emitAddListWhenCreatingQueue: true,
    plugins: [
        new DirectLinkPlugin(),
        new BandlabPlugin(),
        //new SoundCloudPlugin(),
        new YtDlpPlugin({ update: false })
    ],
});

// DisTube event listeners, more in the documentation page
client.distube
  .on('playSong', (...args) => {
    // args can be (message, queue, song) or (queue, song)
    let message, queue, song;
    if (args.length === 3) [message, queue, song] = args;
    else if (args.length === 2) [queue, song] = args;
    else {
      queue = args.find(a => a && a.songs) || null;
      song = args.find(a => a && a.name) || null;
    }

    const textChannel = queue?.textChannel ?? (message?.channel ?? message);
    if (!textChannel || typeof textChannel.send !== 'function') return;

    const startembed = new EmbedBuilder()
      .setTitle('Playing...')
      .setThumbnail(song?.thumbnail ?? null)
      .setDescription('Here are the details of the music you are playing right now!')
      .setColor('Red')
      .addFields(
        { name: 'Video/song name:', value: String(song?.name ?? 'Unknown'), inline: true },
        { name: 'Duration:', value: String(song?.formattedDuration ?? 'N/A'), inline: true },
        { name: 'Requested by:', value: String(song?.user ?? 'N/A'), inline: true },
        { name: 'Likes:', value: String(song?.likes ?? 'N/A'), inline: true },
        { name: 'Dislikes:', value: String(song?.dislikes ?? 'N/A'), inline: true },
        { name: 'Views:', value: String(song?.views ?? 'N/A'), inline: true },
        { name: 'Youtube video:', value: String(song?.youtube ?? 'N/A'), inline: true },
        { name: 'Url:', value: String(song?.url ?? 'N/A'), inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Turn up your volume if you cant hear the music!' });

    textChannel.send({ embeds: [startembed] }).catch(console.error);
  })
  .on('addSong', (...args) => {
    // args can be (message, queue, song) or (queue, song)
    let message, queue, song;
    if (args.length === 3) [message, queue, song] = args;
    else if (args.length === 2) [queue, song] = args;

    const textChannel = queue?.textChannel ?? (message?.channel ?? message);
    if (!textChannel || typeof textChannel.send !== 'function') return;

    textChannel.send(`Added ${song?.name ?? 'Unknown'} - \`${song?.formattedDuration ?? 'N/A'}\` to the queue by ${song?.user ?? 'N/A'}`).catch(console.error);
  })
  .on('searchResult', (...args) => {
    // args can be (message, result) or (queue, result)
    let message, result;
    if (args.length === 2) [message, result] = args;
    else if (args.length === 3) [message, , result] = args;

    const textChannel = message?.channel ?? message;
    if (!textChannel || typeof textChannel.send !== 'function') return;

    let i = 0;
    const list = (result || []).map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join('\n');
    textChannel.send(`**Choose an option from below**\n${list}\n*Enter anything else or wait 60 seconds to cancel*`).catch(console.error);
  })
  .on('error', (payload, error) => {
    // payload can be a Queue, Message, TextChannel, or something else
    const textChannel = payload?.textChannel ?? payload?.channel ?? payload;
    if (textChannel && typeof textChannel.send === 'function') {
      textChannel.send(`An error encountered: ${String(error)}`).catch(console.error);
    } else {
      // No channel available — log full payload for debugging
      console.error('DisTube error (no channel):', payload);
      console.error('DisTube error detail:', error);
    }
  })
  .on('debug', (message) => {
    console.debug('DisTube debug:', message)
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    //console.log(interaction);

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}

    }
});


client.on('messageCreate', async message => {
    const db = mongo.db("Bot1");

    client.user.setActivity(`${client.guilds.cache.size} cool dang servers! || !help`, { type: ActivityType.Listening });

    console.log(client.guilds.cache.size);

    if (!message.guild) return;

    //get the prefix for the discord server
    //let prefix = discordprefix.getPrefix(message.guild.id); DEPRECIATED
	let prefix;
	//const guildData = await db.collection("prefixes").findOne({ GuildID: message.guild.id }); AI CODE

    //set prefix to the default prefix if there isn't one
    if (!prefix) prefix = thedefaultPrefix;

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === ChannelType.DM) {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.help.permissions) {
        const memberPerms = message.member?.permissions;
        if (!memberPerms || !memberPerms.has(command.help.permissions)) {
            return message.reply('You can not do this!');
        }
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.help.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.help.name} ${command.help.usage}\``;
        }

        return message.channel.send(reply);
    }

    const { cooldowns } = client;

    if (!cooldowns.has(command.help.name)) {
        cooldowns.set(command.help.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.help.name);
    const cooldownAmount = (command.help.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.help.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.run(client, message, args, prefix, db);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

//Connect client
client.on('ready', () => {
    client.user.setActivity(`${client.guilds.cache.size} cool dang servers! || !help`, { type: ActivityType.Listening });
    console.log(`${client.user.tag} is online!`);
});

keepAlive();

client.login(process.env.TOKEN);