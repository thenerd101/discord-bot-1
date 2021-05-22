const Discord = require("discord.js");
const fs = require("fs");
const discordprefix = require('discord-prefix');

module.exports.run = async (client, message, args, prefix, db) => {

  if(!message.member.hasPermission('MANAGE_GUILD')) return message.reply("sorry, you didn't meet the requirement to use this command. Missing Permission: ``MANAGE_SERVER``");
  if(!args[0] || args[0 == "help"]) return message.reply(`Usage: ${prefix}prefix <new prefix>`);
  
  let sEmbed = new Discord.MessageEmbed()
  .setColor("GREEN")
  .setTitle(`New prefix set to ${args[0]}`);
  
  discordprefix.setPrefix(args[0], message.guild.id);

  /*db.collection("guilds").updateOne({_id: message.guild.id}, {$set: {prefix: args[0]}});*/

  message.channel.send({embed:sEmbed});

}

module.exports.help = {
  name: "setprefix",
  aliases: ["sp"]
}