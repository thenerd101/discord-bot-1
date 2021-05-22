


module.exports.run = async (client, message, args, db) => {
	message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
}



module.exports.help = {
	name: 'user-info',
	description: 'Display info about yourself.',
};