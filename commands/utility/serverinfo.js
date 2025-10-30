const Discord = require('discord.js')
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Display info about this server.'),
	advancedHelp: {
		details: 'This command provides basic information about the server, including its name and the total number of members. It is useful for users who want to quickly check server details without navigating through server settings.',
		usage: '/serverinfo',
		examples: [
			'/serverinfo',
		],
	},
	async execute(interaction) {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	},
};

/*
module.exports.run = async (client, message, args, db) => {
	message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
}



module.exports.help = {
	name: 'serverinfo',
	description: 'Display info about this server.',
};
*/