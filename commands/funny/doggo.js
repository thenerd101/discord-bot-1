const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

function choose(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cleanUrl(url = '') {
  return String(url).replace(/&amp;/g, '&');
}

const SUBREDDITS = ['dog', 'puppy', 'dogpictures', 'dogpics', 'rarepuppers', 'aww'];

async function fetchSubredditJSON(subreddit) {
  const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=100`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'discord-bot (by /u/yourname)',
      'Accept': 'application/json'
    }
  });
  if (!res.ok) return { ok: false, status: res.status };
  const body = await res.json();
  return { ok: true, body };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('doggo')
    .setDescription('Post a random dog image from Reddit'),
  advancedHelp: {
    details: 'This command fetches and posts a random dog image from various dog-related subreddits on Reddit. When a user invokes this command, the bot retrieves a selection of hot posts from subreddits like r/dog, r/puppy, and others, filters for image posts, and then randomly selects one to share in the Discord channel. This is a fun way for users to see cute dog images and brighten their day. Next time you want to see an adorable dog picture, just use this command!',
    usage: '/doggo',
    examples: [
      '/doggo',
    ],
  },
  async execute(interaction) {
    await interaction.deferReply().catch(() => {});

    const candidates = [...SUBREDDITS].sort(() => Math.random() - 0.5);
    let post = null;
    let usedSub = null;

    for (const sub of candidates) {
      try {
        const res = await fetchSubredditJSON(sub);
        if (!res.ok) {
          console.debug(`doggo: /r/${sub} returned status ${res.status}`);
          continue;
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
        console.error(`doggo: fetch error for /r/${sub}:`, err);
        continue;
      }
    }

    if (!post) {
      await interaction.editReply({ content: 'Could not find a dog image right now — try again in a bit.', ephemeral: true }).catch(() => {});
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
      await interaction.reply({ embeds: [embed] }).catch(() => {});
    });
  },
};

/*
module.exports.run = async (client, message, args, prefix, db) => {
    const subReddits = ["dog", "puppy", "dogimages"]
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];
    if(!Math.random()) return;
    const img = await randomPuppy(random);

    const embed = new Discord.MessageEmbed()
    .setImage(img)
    .setTitle(`From /r/${random}`)
    .setURL(`http://reddit.com/${random}`)

    message.channel.send(embed);
}

module.exports.help = {
    name: 'doggo',
    description: 'post a doggo image!',
    cooldown: 5,
}
*/