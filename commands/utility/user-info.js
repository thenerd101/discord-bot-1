const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user-info')
		.setDescription('Display info about yourself.'),
	advancedHelp: {
		details: 'This command displays your Discord username and user ID. It is useful for users who need to know their own information, perhaps for troubleshooting or identification purposes within the server. Simply invoke the command, and the bot will respond with your details.',
		usage: '/user-info',
		examples: [
			'/user-info',
		],
	},
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