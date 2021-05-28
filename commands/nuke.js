const Discord = require('discord.js')


module.exports.run = async (client, message, args, prefix, db) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You do not have enough perms to use this command!")
    let reason = args.join(" ") || "No Reason"
    if(!message.channel.deletable) {
        return message.reply("This channel cannot be nuked!")
    }
    let newchannel = await message.channel.clone()
    await message.channel.delete()
    let embed = new Discord.MessageEmbed()
    .setTitle("Channel Nuked")
    .setDescription(reason)
    .setImage('https://media0.giphy.com/media/oe33xf3B50fsc/200.gif')
    await newchannel.send(embed)
}

module.exports.help = {
    name: 'nuke',
    description: 'nuke a specific channel!',
}