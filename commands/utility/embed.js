const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('send a embed message')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The message to embed')
                .setRequired(true)
        ),
    advancedHelp: {
        details: 'This command allows you to send a message embedded in a rich format. You can specify the text you want to include in the embed, and the bot will format it nicely for you. This is useful for highlighting important information or making your messages stand out in the chat.',
        usage: '/embed (message)',
        examples: [
            '/embed Hello, this is an embedded message!',
            '/embed Here is some important information in an embed.',
        ],
    },
    async execute(interaction) {
        const text = interaction.options.getString('text');
        if (!text) {
            return interaction.reply(`you need to add more text like this. \`\`/embed (message)\`\``);
        }
        const embed101 = new EmbedBuilder()
            .setTitle(`${interaction.user.tag}'s Embed Message`)
            .setDescription(text)
            .setColor('Green')
            .setTimestamp();
        await interaction.reply({ embeds: [embed101] });
    },
};



/*
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
*/