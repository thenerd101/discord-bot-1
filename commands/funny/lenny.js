const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lenny')
        .setDescription('just a face of lenny'),
    advancedHelp: {
      details: 'This command simply sends the classic "lenny face" emoticon ( ͡° ͜ʖ ͡°) in the chat. It is often used to convey a mischievous or playful tone in conversations. When a user invokes this command, the bot responds with the lenny face, adding a bit of fun and humor to the interaction. Next time you want to share a lenny face, just use this command!',
      usage: '/lenny',
      examples: [
        '/lenny',
      ],
    },
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