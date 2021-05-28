




module.exports.run = async (client, message, args, prefix, db) => {
	const amount = parseInt(args[0]);

	if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.reply("you are not allowed to use this command!")
    }

	if (isNaN(amount)) {
		return message.reply('that doesn\'t seem to be a valid number.');
	} else if (amount <= 1 || amount > 100) {
		return message.reply('you need to input a number between 1 and 99.');
	}

	message.channel.bulkDelete(amount, true)
	message.reply(`${amount} messages have been purged.`)
	 .catch(err => {
		console.error(err);
		message.channel.send('there was an error trying to purge messages in this channel!');
	});
}




module.exports.help = {
	name: 'purge',
	description: 'purge up to 99 messages.',
}