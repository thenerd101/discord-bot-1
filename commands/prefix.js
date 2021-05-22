/*const prefix = require('../index.js');*/

/*prefix.setPrefix('!', 'guild_id');
console.log(prefix.getPrefix('guild_id'));*/

module.exports.run = async (client, message, args, prefix,  db) => {
	if (!message.guild) return;
	message.reply(`<@${client.user.id}>'s prefix for this server ${message.guild.name} is \`\`${prefix}\`\`. If you want to change the prefix, say \`\`${prefix}setprefix\`\`.`);
}





module.exports.help = {
	name: 'prefix',
	description: 'tells you the current prefix for the bot.',
  aliases: ['command name'],
	guildOnly: true,
}