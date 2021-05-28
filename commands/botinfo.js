const Discord = require('discord.js');
const msg = require('discord.js');

module.exports.run = async (client, message, args, prefix, db) => {
  const serverlink = "https://discord.gg/uDTqGkKxVM"
  let startembed = new Discord.MessageEmbed()
  .setTitle('Information')
  .setDescription('Information about ElectroPING')
  .setColor("GREEN")
  .addFields(
    { name: 'The Creator of ElectroPING', value: 'BigPaintballGamer'},
    { name: 'Version of ElectroPING', value: 'ElectroPING V1.0'},
    { name: 'Support Server', value: `${serverlink}`, inline:true}
)
  .setTimestamp()
  .setFooter('Thank you so much for anyone who has joined the support server and those who has the bot in their servers. ');
  message.channel.send({embed:startembed});
}

module.exports.help = {
  name: "botinfo",
  desc: "Check the info about this bot."
}