const punishments = require('../models/ModSchema');
const Discord = require('discord.js');
const image = "https://cdn.shopify.com/s/files/1/1061/1924/products/Very_Angry_Emoji_7f7bb8df-d9dc-4cda-b79f-5453e764d4ea_large.png?v=1571606036"

module.exports.run = async (client, message, args, prefix, db) => {
    let toWarn = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join(" ") || x.user.username === args[0]);

    if(!toWarn) return message.reply("You need to mention someone!");

    if (!message.member.hasPermission("KICK_MEMBERS")) {
        return message.reply("You are not allowed to warn members!")
    }

    if(message.author.id === toWarn.id) return message.reply("You cannot warn yourself!");

    if(message.guild.owner.id === toWarn.id) return message.reply("You cannot warn a owner of a discord server!");

    let reason = args.slice(1).join(" ")

    if(!reason) return message.channel.send('NO REASON!')

    let data = await punishments.findOne({
        GuildID: message.guild.id,
        UserID: toWarn.id
    });

    if(data) {
        data.Punishments.unshift({
            PunishType: 'Warn',
            Moderator: message.author.id,
            Reason: reason,
        });
        data.save();

        let embedwarn1 = new Discord.MessageEmbed()
        
        .setImage(image)
        .setTitle(`${message.guild.name} warning`)
        .setDescription(`${message.author.tag} has warned you for: \`${reason}\``)
        .setColor('RED')
        .setTimestamp()
        .setFooter(`${toWarn}, do you wanna become a bad boi?`)

        console.log(toWarn)

        message.channel.send(`warned ${toWarn} for \`${reason}\``)
        toWarn.send(embedwarn1)
    } else if (!data) {
        let newData = new punishments({
            GuildID: message.guild.id,
            UserID: toWarn.id,
            Punishments: [{
                PunishType: 'Warn',
                Moderator: message.author.id,
                Reason: reason,
            }, ],
        });
        newData.save();

        let embedwarn2 = new Discord.MessageEmbed()
        
        .setImage(image)
        .setTitle(`${message.guild.name} warning`)
        .setDescription(`${message.author.tag} has warned you for: \`${reason}\``)
        .setColor('RED')
        .setTimestamp()
        .setFooter(`${toWarn}, do you wanna become a bad boi?`)






        console.log(toWarn)


        message.channel.send(`warned ${toWarn} for \`${reason}\``)
        toWarn.send(embedwarn2)
    }


}

module.exports.help = {
    name: "warn",
    aliases: []
}