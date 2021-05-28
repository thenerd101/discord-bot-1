const Discord = require('discord.js');




module.exports.run = async (client, message, args, db) => {
	if (!message.mentions.users.size) {
		let startembed = new Discord.MessageEmbed()
		.setImage(message.author.displayAvatarURL({ dynamic: true }))
		.setTitle('Your avatar')
		.setColor('GREEN')
		.setTimestamp()
		.setFooter(`${message.author.tag}, you should join our support server!`) 
		message.channel.send({ embed:startembed })  /*message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ dynamic: true })}>`);*/
	}

	message.mentions.users.map(user => {
		let startembed2 = new Discord.MessageEmbed()
		.setImage(user.displayAvatarURL({ dynamic: true }))
		.setTitle(`${user.tag}'s avatar`)
		.setColor('GREEN')
		.setTimestamp()
		.setFooter(`${message.author.tag}, you should join our support server!`) 
		message.channel.send({ embed:startembed2 })		
		/*`${user.username}'s avatar: <${user.displayAvatarURL({ dynamic: true })}>`;*/
	});
}






module.exports.help = {
	name: 'avatar',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
	aliases: ['icon', 'pfp'],
	cooldown: 10,
}