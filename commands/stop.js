


module.exports.run = async (client, message, args, db) => {
    if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel to use this command!');

        let queue = client.distube.getQueue(message);

        if (queue) {
        client.distube.stop(message);
        message.channel.send("The music has been stopped!");
     } else if (!queue) {
        return

    }
}



module.exports.help = {
    name: 'stop',
    aliases: [],
};