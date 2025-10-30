const { translate } = require('@vitalets/google-translate-api');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate words from other languages!')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('The language to translate to (e.g., "en" for English, "es" for Spanish)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The text to translate')
                .setRequired(true)
        ),
    advancedHelp: {
        details: 'This command translates text from one language to another using the Google Translate API. Users can specify the target language and the text they want to translate. It is useful for communicating across different languages or understanding foreign text. Simply provide the language code and the text, and the bot will return the translated version along with the detected source language. Give it a try next time you need a quick translation! [NOTE: Make sure to use valid language codes. List: es - Spanish, fr - French, de - German, it - Italian, ja - Japanese, zh-CN - Chinese (Simplified), ru - Russian, pt - Portuguese, ar - Arabic, hi - Hindi, and many more. More codes can be found online. More info at https://cloud.google.com/translate/docs/languages]',
        usage: '/translate <language> <input>',
        examples: [
            '/translate es Hello, how are you?',
            '/translate fr Good morning!',
        ],
    },
    async execute(interaction) {
        const lang = interaction.options.getString('language');
        const suffix = interaction.options.getString('input');

        try {
            const res = await translate(suffix, { to: lang });
            //console.log(res); Code Line: For Testing and Debugging

            const embed = new EmbedBuilder()
                .setColor('#4885ed')
                .setAuthor({ name: `Language detected: "${res.raw.src}"`, iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/250px-Google_Translate_logo.svg.png' }) // Updated to use iconURL property | Old: `http://nyamato.me/i/kbfuj.png`
                .setDescription(`**Original (${res.raw.src})**: ${suffix}\n**Translation (${lang})**: ${res.text}`)
                .setTimestamp()
                .setFooter({ text: 'API Latency is ' + `${Date.now() - interaction.createdTimestamp}` + ' ms', iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            // fetch the reply message and react to it
            const sent = await interaction.fetchReply();
            if (sent && sent.react) await sent.react('👌').catch(() => { });
        } catch (error) {
            console.error('translate command error:', error);
            const errEmbed = new EmbedBuilder()
                .setColor(0xff2727)
                .setDescription(`:warning: **${interaction.user.username}**, ${String(error)}`)
                .setTimestamp()
                .setFooter({ text: 'API Latency is ' + `${Date.now() - interaction.createdTimestamp}` + ' ms' });

            // reply ephemerally for errors (no reaction possible on ephemeral replies)
            await interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(() => { });
        }
    },
};

/*
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
*/