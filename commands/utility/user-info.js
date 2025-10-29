const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user-info')
		.setDescription('Display info about yourself.'),
	async execute(interaction) {
		await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
	},
};

/*
module.exports.run = async (client, message, args, db) => {
	message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
}



module.exports.help = {
	name: 'user-info',
	description: 'Display info about yourself.',
};
*/