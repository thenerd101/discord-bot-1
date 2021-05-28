const Discord = require('discord.js');
const randomPuppy = require('random-puppy');

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