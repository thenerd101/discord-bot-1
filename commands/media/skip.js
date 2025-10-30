const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skip the current song and play the next one in the queue!'),
    advancedHelp: {
        details: 'This command is used to skip the currently playing song and move to the next song in the music queue. When a user invokes this command while in a voice channel, the bot will stop the current track and immediately start playing the next track in the queue. This is particularly useful when the user wants to quickly change the music without waiting for the current song to finish. Next time you want to skip a song, just use this command!',
        usage: '/skip',
        examples: [
            '/skip',
        ],
    },
    async execute(interaction) {
        const client = interaction.client;
        const member = interaction.member;
        const voiceChannel = member?.voice?.channel;
        if (!voiceChannel) return safeReply(interaction, 'You must be in a voice channel to use this command!');

        // Try a few ways to get the queue
        const queue = client.distube.getQueue(interaction) 
            || client.distube.getQueue(interaction.guildId) 
            || client.distube.getQueue(voiceChannel);

        if (!queue || !queue.songs || queue.songs.length === 0) {
            return safeReply(interaction, 'There is no music playing right now!');
        }

        // If there's only the current song, there's nothing "up next"
        if (queue.songs.length < 2) {
            return safeReply(interaction, 'There is no next song to skip to.');
        }

        try {
            await client.distube.skip(interaction);
            return safeReply(interaction, 'Skipped to the next song.');
        } catch (err) {
            console.error('skip command error:', err);
            // Distube throws an error with an errorCode property
            if (err?.errorCode === 'NO_UP_NEXT' || /no up next/i.test(String(err?.message || ''))) {
                return safeReply(interaction, 'There is no next song to skip to.');
            }
            return safeReply(interaction, 'Failed to skip the song. Try again.');
        }
    }
};

async function safeReply(interaction, content) {
    const opts = { content, ephemeral: true };
    try {
        if (interaction.replied || interaction.deferred) {
            return await interaction.followUp(opts).catch(() => {});
        } else {
            return await interaction.reply(opts).catch(() => {});
        }
    } catch {
        // swallow errors to avoid throwing from helper
    }
}