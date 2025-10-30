const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Tag a member and kick them.'),
	advancedHelp: {
		details: 'This command allows a user with the appropriate permissions to kick a specified member from the server. The user must mention the member they wish to kick. The command checks for necessary permissions and ensures that the user is not attempting to kick themselves or the server owner. If the bot has the required permissions, it will proceed to kick the member and confirm the action. This command is useful for server moderation and maintaining community standards.',
		usage: '/kick @user',
		examples: [
			'/kick @Troublemaker',
			'/kick @Spammer',
			'/kick @User123',
		],
	},
	async execute(interaction) {
		let member = interaction.options.getMember('user');
		if (!interaction.member.permissions.has("KICK_MEMBERS")) {
			return interaction.reply("you are not allowed to kick members!");
		}
		if(!member) return interaction.reply('you need to mention someone to kick!');
		if(interaction.user.id === member.id) return interaction.reply("you cannot kick yourself!");
		if(interaction.guild.ownerId === member.id) return interaction.reply('you cannot kick the owner!');
		if(!member.kickable) return interaction.reply("I cannot kick this member!");
		await member.kick(); //.kick(reason) if you would to put in the reason through arguments
		return interaction.reply(`member ${member} has been kicked.`);
	}
}

/*
module.exports.run = async (client, message, args, db) => {
	let member = message.mentions.members.first();

	if (!message.member.hasPermission("KICK_MEMBERS")) {
        return message.reply("you are not allowed to kick members!")
    }

	if(!member) return message.reply('you need to mention someone to kick!')

	if(message.author.id === member.id) return message.reply("you cannot kick yourself!")

	if(guild.ownerID === member.id) return message.reply('you cannot kick the owner!')

    if(!member) return message.reply("Please mention a valid member of this server");
    if(!member.kickable) return message.reply("I cannot kick this member!");

    member.kick(); //.kick(reason) if you would to put in the reason through arguments

	message.reply(`member ${member} has been kicked.`)
}





module.exports.help = {
	name: 'kick',
	description: 'Tag a member and kick them.',
	guildOnly: true,
}
*/
