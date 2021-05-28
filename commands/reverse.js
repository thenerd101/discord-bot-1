module.exports.run = async (client, message, args, prefix, db) => {
    const text = args.join(" ")
    if(!text) return message.reply("Please give something to reverse!")
    let Rarray = text.split("")
    let reverseArray = Rarray.reverse()
    let result = reverseArray.join("")
    message.channel.send(result)
}


module.exports.help = {
    name: 'reverse',
    description: 'reverse a message of text!'
}