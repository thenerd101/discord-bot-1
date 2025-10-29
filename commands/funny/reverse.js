const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reverse')
        .setDescription('reverse a message of text!')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to reverse')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        let Rarray = text.split("")
        let reverseArray = Rarray.reverse()
        let result = reverseArray.join("")
        await interaction.reply(result);
    },
};

/*
module.exports.run = async (client, message, args, prefix, db) => {
    const text = args.join(" ")
    if(!text) return message.reply("Please give something to reverse!")
    let Rarray = text.split("")
    let reverseArray = Rarray.reverse()
    let result = reverseArray.join("")
    message.channel.send(result)
}


module.exports.help = {
    name: 'reverse',
    description: 'reverse a message of text!'
}
*/