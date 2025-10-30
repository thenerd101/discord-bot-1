const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

function choose(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cleanUrl(url = '') {
  return String(url).replace(/&amp;/g, '&');
}

// valid meme subreddits (common names)
const SUBREDDITS = ['memes', 'me_irl', 'dankmemes', 'wholesomememes', 'ComedyCemetery', 'PrequelMemes'];

async function fetchSubredditJSON(subreddit) {
  const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=100`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'discord-bot (by /u/yourname)',
      'Accept': 'application/json'
    },
    // follow redirects
  });
  if (!res.ok) {
    // return status for debugging / decision making
    return { ok: false, status: res.status };
  }
  const body = await res.json();
  return { ok: true, body };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Post a random meme from a meme subreddit'),
  advancedHelp: {
    details: 'This command fetches and posts a random meme from popular meme subreddits on Reddit. When a user invokes this command, the bot retrieves a selection of hot posts from various meme-focused subreddits, filters for image posts, and randomly selects one to share in the Discord channel. This is a fun way to get a quick laugh or share memes with friends. Next time you want to see a random meme, just use this command!',
    usage: '/meme',
    examples: [
      '/meme',
    ],
  },
  async execute(interaction) {
    await interaction.deferReply().catch(() => {}); // give more time for fetches

    // shuffle candidate subreddits and try up to N distinct ones
    const candidates = [...SUBREDDITS].sort(() => Math.random() - 0.5);
    let post = null, usedSub = null;

    for (const sub of candidates) {
      try {
        const res = await fetchSubredditJSON(sub);
        if (!res.ok) {
          console.debug(`meme: /r/${sub} returned status ${res.status}`);
          continue; // try next subreddit
        }

        const posts = (res.body?.data?.children || []).map(c => c.data);
        const imagePosts = posts.filter(p => {
          if (!p || p.stickied || p.over_18) return false;
          if (p.post_hint === 'image') return true;
          if (/\.(jpe?g|png|gif|webp)$/.test(p.url || '')) return true;
          if (p.preview && p.preview.images && p.preview.images.length) return true;
          return false;
        });

        if (!imagePosts.length) continue;

        post = choose(imagePosts);
        usedSub = sub;
        break;
      } catch (err) {
        console.error(`meme: fetch error for /r/${sub}:`, err);
        continue;
      }
    }

    if (!post) {
      await interaction.editReply({ content: 'Could not find a meme right now — try again in a bit.', ephemeral: true }).catch(() => {});
      return;
    }

    let imageUrl = post.url;
    if (!imageUrl || !/\.(jpe?g|png|gif|webp)$/.test(imageUrl)) {
      const preview = post.preview?.images?.[0]?.source?.url;
      imageUrl = preview || imageUrl;
    }
    imageUrl = cleanUrl(imageUrl);

    const embed = new EmbedBuilder()
      .setTitle(post.title || `From /r/${usedSub}`)
      .setURL(`https://reddit.com${post.permalink || ''}`)
      .setImage(imageUrl)
      .setColor('Random')
      .setAuthor({ name: `r/${post.subreddit} • u/${post.author}` })
      .setFooter({ text: `👍 ${post.ups ?? 0} • 💬 ${post.num_comments ?? 0} • Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] }).catch(async () => {
      // fallback to a normal reply if edit fails
      await interaction.reply({ embeds: [embed] }).catch(() => {});
    });
  },
};

/*
module.exports.run = async (client, message, args, prefix, db) => {
    const subReddits = ["meme", "me_irl", "dankmeme"]
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];
    const img = await randomPuppy(random);

    const embed = new Discord.MessageEmbed()
    .setImage(img)
    .setTitle(`From /r/${random}`)
    .setURL(`http://reddit.com/${random}`)

    message.channel.send(embed);

}

module.exports.help = {
    name: 'meme',
    description: 'post a meme!'
}
*/