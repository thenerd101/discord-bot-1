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