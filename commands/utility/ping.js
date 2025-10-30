const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping! Replies with the bot\'s ping in ms.'),
	advancedHelp: {
		details: 'This command is used to check the bot\'s current latency (ping) to the Discord server. When a user invokes this command, the bot responds with its ping in milliseconds. This is useful for users who want to monitor the bot\'s responsiveness and connection quality. Next time you want to check how quickly the bot is responding, just use this command!',
		usage: '/ping',
		examples: [
			'/ping',
		],
	},
	async execute(interaction) {
		await interaction.reply(`Pong! The bot's ping is ${interaction.client.ws.ping}ms.`);
	},
};

/*
module.exports.run = async (client, message, args, db) => {
	message.channel.send(`Pong! The bot's ping is ${client.ws.ping}ms.`);
}




module.exports.help = {
	name: 'ping',
	description: 'Ping!',
};
*/