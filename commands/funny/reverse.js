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
    advancedHelp: {
        details: 'This command takes a string of text provided by the user and reverses the order of the characters in that text. When a user invokes this command with a specific message, the bot processes the input and returns the reversed version of that message. This can be a fun way to play with text and see how words look when flipped backwards. Next time you want to see your message in reverse, just use this command!',
        usage: '/reverse [text]',
        examples: [
            '/reverse Hello World!',
            '/reverse Discord Bot',
        ],
    },    
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