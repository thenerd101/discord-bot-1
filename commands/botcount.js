


module.exports.run = async (client, message, args, prefix, db) => {
  message.reply(`the bot is in ${client.guilds.cache.size} servers.`)
}



module.exports.help = {
  name: "botcount",
  desc: "Check how many servers the bot is in.",
}