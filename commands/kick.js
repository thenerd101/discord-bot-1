


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
