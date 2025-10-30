const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List all of my commands or info about a specific command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to get info about')
				.setRequired(false)),
	advancedHelp: {
		details: 'This command is used to get a list of all commands or detailed information about a specific command. When used without arguments, it sends a DM to the user with a list of all available commands. When provided with a command name, it returns information about that specific command. It is useful for users who need assistance navigating the bot\'s features. Next time, if your not sure what commands this bot supports, or its uses, then give this command a try! [NOTE: If your DMs are disabled, you will not receive the list of commands.]',
		usage: '/help [command]',
		examples: [
			'/help',
			'/help ping',
		],
	},
	async execute(interaction) {
		const data = [];
		const { commands } = interaction.client;
		const args = interaction.options.getString('command');

		if (!args) {
			//data.push('Here\'s a list of all my commands:');
			data.push(commands.map(command => command.data.name).join(', '));
			data.push(`\nYou can send \`/help [command name]\` to get info on a specific command!`);

			const embed = new EmbedBuilder()
				.setTitle('Help - List of Commands')
				.setDescription(data.join('\n'))
				.setColor(0x00AE86);
			return interaction.user.send({ embeds: [embed] })
				.then(() => {
					if (interaction.channel.type === 'DM') return;
					interaction.reply({ content: 'I\'ve sent you a DM with all my commands!', ephemeral: true });
				})
				.catch(error => {
					console.error(`Could not send help DM to ${interaction.user.tag}.\n`, error);
					interaction.reply({ content: 'it seems like I can\'t DM you!', ephemeral: true });
				});
		}

		const name = args.toLowerCase();
		const command = commands.get(name) || commands.find(c => c.data.name === name);
		if (!command) {
			return interaction.reply({ content: 'that\'s not a valid command!', ephemeral: true });
		}

		if (command.advancedHelp || command.data.description) data.push(`**Description:** ${command.advancedHelp?.details || command.data.description}`);
		// Add more details if available
		const embed = new EmbedBuilder()
			.setTitle(`Help Info - /${command.data.name}`)
			.setFooter({ text: 'Bot Help System' })
			.setFields(
				{ name: 'Usage', value: command.advancedHelp?.usage || 'No usage information available.' },
				{ name: 'Examples', value: command.advancedHelp?.examples ? command.advancedHelp.examples.join('\n') : 'No examples available.' },
			)
			.setDescription(data.join('\n'))
			.setColor(0x00AE86);
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};

/*
module.exports.run = async (client, message, args, prefix, db) => {
	const data = [];
	const { commands } = message.client;

	if (!args.length) {
		data.push('Here\'s a list of all my commands:');
		data.push(commands.map(command => command.help.name).join(', '));
		data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

	 return message.author.send(data, { split: true })
		.then(() => {
			if (message.channel.type === 'dm') return;
			message.reply('I\'ve sent you a DM with all my commands!');
		})
		.catch(error => {
			console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
			message.reply('it seems like I can\'t DM you!');
		});
	}

	const name = args[0].toLowerCase();
	const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

	if (!command) {
		return message.reply('that\'s not a valid command!');
	}

	data.push(`**Name:** ${command.help.name}`);

	if (command.help.aliases) data.push(`**Aliases:** ${command.help.aliases.join(', ')}`);
	if (command.help.description) data.push(`**Description:** ${command.help.description}`);
	if (command.help.usage) data.push(`**Usage:** ${prefix}${command.help.name} ${command.help.usage}`);

	data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

	message.channel.send(data, { split: true });
}






module.exports.help = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
};
*/