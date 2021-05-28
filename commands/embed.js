const Discord = require('discord.js')




module.exports.run = async (client, message, args, prefix, db) => {
    const text = args.slice().join(" ")

    if(!args[0] || args[0 == "embed"]) return message.reply(`you need to add more text like this. \`\`${prefix}embed (message)\`\``)

    let embed101 = new Discord.MessageEmbed()

    .setTitle(`${message.author.tag}'s Embed Message`)
    .setDescription(text)
    .setColor("GREEN")
    .setTimestamp()

    message.channel.send(embed101);
}



module.exports.help = {
    name: 'embed',
    description: 'send a embed message',
    usage: ['message'],
}