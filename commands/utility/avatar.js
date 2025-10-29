const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get the avatar URL of the tagged user(s), or your own avatar.')
		.addUserOption(option => 
			option.setName('user')
				.setDescription('The user to get the avatar of')
				.setRequired(false)
		),

	async execute(interaction) {
		const user = interaction.options.getUser('user') || interaction.user;
        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
            .setTitle(`${user.tag}'s avatar`)
            .setImage(avatarURL)
            .setColor('Green')
            .addFields({ name: 'Avatar URL', value: `[Open avatar](${avatarURL})` })
            .setTimestamp()
            .setFooter({ text: `${interaction.user.tag}, you should join our support server!` });

        await interaction.reply({ embeds: [embed] });
	},
};



/*
module.exports.run = async (client, message, args, db) => {
	if (!message.mentions.users.size) {
		let startembed = new Discord.MessageEmbed()
		.setImage(message.author.displayAvatarURL({ dynamic: true }))
		.setTitle('Your avatar')
		.setColor('GREEN')
		.setTimestamp()
		.setFooter(`${message.author.tag}, you should join our support server!`) 
		message.channel.send({ embed:startembed })  /*message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ dynamic: true })}>`);
	}

	message.mentions.users.map(user => {
		let startembed2 = new Discord.MessageEmbed()
		.setImage(user.displayAvatarURL({ dynamic: true }))
		.setTitle(`${user.tag}'s avatar`)
		.setColor('GREEN')
		.setTimestamp()
		.setFooter(`${message.author.tag}, you should join our support server!`) 
		message.channel.send({ embed:startembed2 })		
		/*`${user.username}'s avatar: <${user.displayAvatarURL({ dynamic: true })}>`;
	});
}


*/

/*

module.exports.help = {
	name: 'avatar',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
	aliases: ['icon', 'pfp'],
	cooldown: 10,
}
*/
