const Discord = require('discord.js')



module.exports.run = async (client, message, args, db) => {
	message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
}



module.exports.help = {
	name: 'serverinfo',
	description: 'Display info about this server.',
};