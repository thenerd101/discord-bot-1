


module.exports.run = async (client, message, args, db) => {
	message.channel.send(`Pong! The bot's ping is ${client.ws.ping}ms.`);
}




module.exports.help = {
	name: 'ping',
	description: 'Ping!',
};