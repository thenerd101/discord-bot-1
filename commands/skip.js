

module.exports.run = async (client, message, args, db) => {
    if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel to use this command!');

    let queue = client.distube.getQueue(message);

    if (queue) {
    client.distube.skip(message)
    message.channel.send("Skipping to the next queue...");
    } else if (!queue) {
        return
    };
}


module.exports.help = {
    name: 'skip',
    aliases: [],
}