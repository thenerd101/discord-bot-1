const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lenny')
        .setDescription('just a face of lenny'),
    async execute(interaction) {
        await interaction.reply('( ͡° ͜ʖ ͡°)');
    },
};

/*
module.exports.run = async (client, message, args, prefix, db) => {
  message.channel.send('( ͡° ͜ʖ ͡°)');
}
  
  
  
module.exports.help = {
  name: "lenny",
  desc: "just a face of lenny",
}
*/   