const Discord = require('discord.js');
const ytdl = require('ytdl-core');

module.exports.run = async (client, message, args, db) => {
    if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel to use this command!');

    const music = args.join(" ")

    client.distube.play(message, music)
}

module.exports.help = {
    name: 'play',
    aliases: ['p']
}