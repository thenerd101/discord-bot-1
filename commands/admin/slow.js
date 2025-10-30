const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slow')
        .setDescription('turn on slowmode for a channel!')
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('Duration in seconds')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for setting slowmode')
                .setRequired(true)
        ),
    advancedHelp: {
        details: 'This command allows administrators to set a slowmode for the current channel. You can specify the duration in seconds and provide a reason for setting the slowmode. This is useful for managing chat flow during busy times or events. Please note that this command requires administrator permissions to execute.',
        usage: '/slow [duration] [reason]',
        examples: [
            '/slow 10 Spamming',
            '/slow 30 Event in progress',
        ],
    },
    async execute(interaction) {
        if(!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply("You don't have enough perms to use this command!")
        }
        let duration = interaction.options.getInteger('duration')
        let reason = interaction.options.getString('reason')
        interaction.channel.setRateLimitPerUser(duration, reason)
        interaction.reply(`Successfully set the slowmode to ${duration} seconds with Reason - ${reason}`)
    },
};

/*
module.exports.run = async (client, message, args, prefix, db) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) {
        return message.reply("You don't have enough perms to use this command!")
    }
    let duration = args[0]
    if(isNaN(duration)) return message.reply("Please give the time in seconds.")
    let reason = args.slice(1).join(" ")
    if(!reason) return message.reply("Please specify a reason!")
    
    message.channel.setRateLimitPerUser(duration, reason)
    message.reply(`Successfully set the slowmode to ${duration} seconds with Reason - ${reason}`)
}


module.exports.help = {
    name: 'slow',
    description: 'turn on slowmode for a channel!'
}
*/