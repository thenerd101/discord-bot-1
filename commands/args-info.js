


module.exports.run = async (client, message, args, db) => {
	if (args[0] === 'foo') {
		return message.channel.send('bar');
	}

	message.channel.send(`First argument: ${args[0]}`);
}


module.exports.help = {
	name: 'args-info',
	description: 'Information about the arguments provided.',
	args: true,
};