const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping!'),
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