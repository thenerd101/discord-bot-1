const fs = require('fs');
const path = require('path');

const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { DirectLinkPlugin } = require('@distube/direct-link');
const { BandlabPlugin } = require('@distube/bandlab');
const { YouTubePlugin } = require('@distube/youtube');

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
//client.cooldowns = new Collection();
//client.aliases = new Collection();

//MongoDB Variables
const { MongoClient } = require("mongodb");
const e = require('express');
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

//let thedefaultPrefix = defaultprefix;

// Create a new DisTube

client.distube = new DisTube(client, {
	emitNewSongOnly: true,
    joinNewVoiceChannel: true,
    emitAddSongWhenCreatingQueue: true,
    emitAddListWhenCreatingQueue: true,
    plugins: [
        new DirectLinkPlugin(),
        new BandlabPlugin(),
        new SoundCloudPlugin(),
        //new YouTubePlugin(),
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
        { name: 'Url:', value: String(song?.url ?? 'N/A'), inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Turn up your volume if you cant hear the music!' });

    textChannel.send({ embeds: [startembed] }).catch(console.error);
  })
  .on('finishSong', (...args) => {
    // args can be (message, queue) or (queue)
    let message, queue;
    if (args.length === 2) [message, queue] = args;
    else if (args.length === 1) [queue] = args;

    const textChannel = queue?.textChannel ?? (message?.channel ?? message);
    if (!textChannel || typeof textChannel.send !== 'function') return;

    textChannel.send('Music has stopped..').catch(console.error);
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
  .on('error', (error, payload) => {
    // payload can be a Queue, Message, TextChannel, or something else
    
    console.log('Payload:', payload);

    const textChannel = payload?.textChannel ?? payload?.channel ?? payload?.message?.channel ?? null;
    if (textChannel && typeof textChannel.send === 'function') {
        console.log('Sending error message to text channel.');
        const embed = new EmbedBuilder()
            .setTitle('An error occurred! :(')
            .setDescription('Sorry, an error was encountered while processing your request.')
            .setColor('Red')
            .addFields(
                { name: 'Error Details', value: `\`\`\`${String(error)}\`\`\`` }
            )
            .setFooter({ text: 'Distube Error! Please try again later or contact support if the issue persists.' })
            .setTimestamp();
        textChannel.send({ embeds: [embed] }).catch(console.error);
    } else {
        // No channel available — log full payload for debugging
        console.error('DisTube Error (NO CHANNEL):', error);
        console.error('DisTube Error detail:', payload);
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
        const embed = new EmbedBuilder()
            .setTitle('Error! :(')
            .setDescription('There was an error while executing this command!')
            .setThumbnail('https://i.imgur.com/1X4QZ5R.png')
            .setFields(
                { name: 'Error Details', value: `\`\`\`${error.message}\`\`\`` }
            )
            .setFooter({ text: 'Please try again later or contact support if the issue persists.' })
            .setColor('Red')
            .setTimestamp();
        interaction.reply({ embeds: [embed], ephemeral: true });
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

/* -------------- IGNORE ---------------- /
client.on('messageCreate', async message => {
    //const db = mongo.db("Bot1");

    //client.user.setActivity(`${client.guilds.cache.size} cool dang servers! || NOW SUPPORTS SLASH COMMANDS!`, { type: ActivityType.Listening });
    // presence is managed in the ready handler (rotating statuses). Do not set activity per message.

    //if (!message.guild) return;
});
*/

//Connect client
client.on('ready', () => {
    console.log(`${client.user.tag} is online!`);

    // rotating presence messages every x seconds
    const activityTemplates = [
        () => `${client.guilds.cache.size} cool dang servers! || NOW SUPPORTS SLASH COMMANDS!`,
        () => `${client.guilds.cache.size} cool dang servers! || Ping: ${Math.round(client.ws.ping)}ms`,
        () => `${client.guilds.cache.size} cool dang servers! || Back after 4 YEARS!`
    ];

    let idx = 0;
    // set initial activity immediately
    try {
        client.user.setActivity(activityTemplates[idx](), { type: ActivityType.Listening });
    } catch (e) { /* ignore */ }

    // rotate every x seconds
    setInterval(() => {
        idx = (idx + 1) % activityTemplates.length;
        try {
            client.user.setActivity(activityTemplates[idx](), { type: ActivityType.Listening });
        } catch (e) {
            console.error('Failed to set activity:', e);
        }
    }, 10_000); // seconds to rotate presence messages
});

keepAlive();

client.login(process.env.TOKEN);