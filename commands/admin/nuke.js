const Discord = require('discord.js')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Nuke a specific channel!')
        .addStringOption(option => 
            option.setName('reason')
            .setDescription('Reason for nuking the channel')
            .setRequired(false)
        ),
    advancedHelp: {
        details: 'This command allows administrators to "nuke" a channel, which involves deleting the current channel and creating a new one in its place. This can be useful for quickly clearing out all messages in a channel while retaining its settings and permissions. Users must have administrator permissions to use this command. A reason for the nuke can be provided, which will be displayed in the new channel.',
        usage: '/nuke [reason]',
        examples: [
            '/nuke Spamming',
            '/nuke',
        ],
    },
    async execute(interaction) {
        if(!interaction.member.permissions.has("Administrator")) {
            return interaction.reply("You do not have enough perms to use this command!")
        }
        let reason = interaction.options.getString('reason') || "No Reason"
        let channel = interaction.channel;
        if(!channel.deletable) {
            return interaction.reply("This channel cannot be nuked!")
        }
        let newchannel = await channel.clone()
        await channel.delete()
        let embed = new EmbedBuilder()
            .setTitle("Channel Nuked")
            .setDescription(reason)
            .setImage('https://media0.giphy.com/media/oe33xf3B50fsc/200.gif')
        await newchannel.send({ embeds: [embed] })
    },

}

/*
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
*/