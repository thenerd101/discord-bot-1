const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('stop the music and clear the queue!'),
    async execute(interaction) {
        const client = interaction.client;
        const member = interaction.member;
        const voiceChannel = member?.voice?.channel;
        if (!voiceChannel) return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });

        let queue = client.distube.getQueue(interaction);
        if (queue) {
            try {
                // stop DisTube (clears queue and stops playback)
                client.distube.stop(interaction);

                // ensure the bot leaves the voice channel by destroying the voice connection
                const connection = getVoiceConnection(interaction.guildId);
                if (connection) connection.destroy();

                await interaction.reply({ content: "The music has been stopped and I left the voice channel!", ephemeral: true }).catch(() => {});
            } catch (err) {
                console.error('stop command error:', err);
                await interaction.reply({ content: 'Failed to stop the music or leave the voice channel.', ephemeral: true }).catch(() => {});
            }
        } else {
            return interaction.reply({ content: "There is no music playing right now!", ephemeral: true }).catch(() => {});
        }
    }
};

/*
module.exports.run = async (client, message, args, db) => {
    if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel to use this command!');

        let queue = client.distube.getQueue(message);

        if (queue) {
        client.distube.stop(message);
        message.channel.send("The music has been stopped!");
     } else if (!queue) {
        return

    }
}



module.exports.help = {
    name: 'stop',
    aliases: [],
};
*/