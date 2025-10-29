const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('purge up to 99 messages.')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('The number of messages to purge (1-99)')
				.setRequired(true)
		),
	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');
		if (!interaction.member.permissions.has("ADMINISTRATOR")) {
			return interaction.reply("you are not allowed to use this command!")
		}
		if (isNaN(amount)) {
			return interaction.reply('that doesn\'t seem to be a valid number.');
		} else if (amount <= 1 || amount > 100) {
			return interaction.reply('you need to input a number between 1 and 99.');
		}
		interaction.channel.bulkDelete(amount, true)
		interaction.reply(`${amount} messages have been purged.`)
			.catch(err => {
				console.error(err);
				interaction.channel.send('there was an error trying to purge messages in this channel!');
			}
		);
	},
};



/*
module.exports.run = async (client, message, args, prefix, db) => {
	const amount = parseInt(args[0]);

	if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.reply("you are not allowed to use this command!")
    }

	if (isNaN(amount)) {
		return message.reply('that doesn\'t seem to be a valid number.');
	} else if (amount <= 1 || amount > 100) {
		return message.reply('you need to input a number between 1 and 99.');
	}

	message.channel.bulkDelete(amount, true)
	message.reply(`${amount} messages have been purged.`)
	 .catch(err => {
		console.error(err);
		message.channel.send('there was an error trying to purge messages in this channel!');
	});
}




module.exports.help = {
	name: 'purge',
	description: 'purge up to 99 messages.',
}
*/