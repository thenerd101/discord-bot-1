const translate = require('@vitalets/google-translate-api');
const Discord = require(`discord.js`);

module.exports.run = async (client, message, args, prefix, db) => {
    let lang = args[0];
    let suffix = args.slice(1).join(' ');
    if (!suffix) message.channel.send({
        embed: {
            color: 0xff2727,
            description: `:warning: **${message.author.username}**, You didn't give me anything to translate.\n{${prefix}translate \`language\` \`input\`}`,
            timestamp: new Date(),
            footer: {
                text: 'API Lantancy is ' + `${Date.now() - message.createdTimestamp}` + ' ms'
            }
        }
    });
    if (!lang) return;
    translate(suffix, {to: lang}).then(res => {
        console.log(res.text)
        console.log(res.from.language.iso)
        let embed = new Discord.MessageEmbed()
        .setColor(`#4885ed`)
        .setAuthor(`Language detected: "${res.from.language.iso}"`, `http://nyamato.me/i/kbfuj.png`)
        .setDescription(`**Original (${res.from.language.iso})**: ${suffix}\n**Translation (${lang})**: ${res.text}`)
        .setTimestamp()
        .setFooter('API Lantancy is ' + `${Date.now() - message.createdTimestamp}` + ' ms', message.author.displayAvatarURL);
        return message.channel.send({ embed });
    }).catch(error => message.channel.send({
        embed: {
            color: 0xff2727,
            description: `:warning: **${message.author.username}**, ${error}`,
            timestamp: new Date(),
            footer: {
                text: 'API Lantancy is ' + `${Date.now() - message.createdTimestamp}` + ' ms'
            }
        }
    })); return message.react("👌");
};


module.exports.help = {
    name: 'translate',
    description: 'translate words from other languages!',
}