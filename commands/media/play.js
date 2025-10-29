const { SlashCommandBuilder } = require('discord.js');
// added yt-search back as requested
const yts = require('yt-search');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('play a song in a voice channel!')
    .addStringOption(option =>
      option.setName('music')
        .setDescription('The music to play (name or url)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const client = interaction.client;
    const member = interaction.member;
    const voiceChannel = member?.voice?.channel;
    if (!voiceChannel) return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });

    const music = interaction.options.getString('music');
    await interaction.reply({ content: `Attempting to play: \`${music}\``, ephemeral: true }).catch(() => {});

    const playOptions = {
      member,
      textChannel: interaction.channel
    };

    try {
      // Let DisTube + @distube/yt-dlp handle searching/extraction first.
      await client.distube.play(voiceChannel, music, playOptions);
      await interaction.editReply({ content: `Playing or queued: \`${music}\`` }).catch(() => {});
      return;
    } catch (err) {
      console.error('play command error:', err);

      const noResult = err && (err.code === 'NO_RESULT' || /Cannot find any song/i.test(String(err.message || '')));
      if (!noResult) {
        const msg = 'Failed to play the requested song. Try a different query or URL.';
        await interaction.editReply({ content: msg }).catch(async () => {
          await interaction.followUp({ content: msg, ephemeral: true }).catch(() => {});
        });
        return;
      }

      // Fallback: use yt-search to find a YouTube video and try to play its URL
      try {
        const search = await yts(music);
        const video = search?.videos?.[0] ?? null;
        if (!video) {
          await interaction.editReply({ content: 'No results found for that query.' }).catch(() => {});
          return;
        }

        const videoUrl = video.url || (video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : null);
        console.log('play fallback found video:', { title: video.title, url: videoUrl });

        if (!videoUrl) {
          await interaction.editReply({ content: 'Found a result but could not determine a playable URL.' }).catch(() => {});
          return;
        }

        try {
          await client.distube.play(voiceChannel, videoUrl, playOptions);
          await interaction.editReply({ content: `Playing: ${video.title}` }).catch(() => {});
          return;
        } catch (playErr) {
          console.error('play command fallback play error:', playErr);
          await interaction.editReply({ content: 'Found a result but failed to play it. Try another result or use a direct URL.' }).catch(() => {});
          return;
        }
      } catch (searchErr) {
        console.error('yt-search error:', searchErr);
        await interaction.editReply({ content: 'No results found and search failed.' }).catch(() => {});
        return;
      }
    }
  }
};

/*
module.exports.run = async (client, message, args, db) => {
    if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel to use this command!');

    const music = args.join(" ")

    client.distube.play(message, music)
}

module.exports.help = {
    name: 'play',
    aliases: ['p']
}
*/