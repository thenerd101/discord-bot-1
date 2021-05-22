const Discord = require('discord.js');
const msg = require('discord.js');

module.exports.run = async (client, message, args, db) => {
  let startembed = new Discord.MessageEmbed()
  .setTitle('Information')
  .setDescription('Information about Moz Bot')
  .setColor("#7f7fff")
  .addFields(
    { name: 'The Creator of Moz Bot', value: 'BigPaintballGamer', inline:true},
    { name: 'Version of Moz Bot', value: 'Moz Bot V1.0', inline:true},
    { name: 'Server Type', value: 'N/A (as of 4/19/21)', inline:true}
)
  .setTimestamp()
  .setFooter('Thank you so much for anyone who has joined the support server and those who has the bot in their servers. ');
  message.channel.createMessage({embed:startembed});
}

module.exports.help = {
  name: "botinfo",
  desc: "Check the info about this bot."
}