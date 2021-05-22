


module.exports.run = async (client, message, args, db) => {
	let member = message.mentions.members.first();

    if(!member) return message.reply("Please mention a valid member of this server");
    if(!member.kickable) return message.reply("I cannot kick this member!");

    member.kick(); //.kick(reason) if you would to put in the reason through arguments
}





module.exports.help = {
	name: 'kick',
	description: 'Tag a member and kick them.',
	guildOnly: true,
	permissions: 'KICK_MEMBERS',
}
