const weather = require(`weather-js`);
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('See your current forecast with this command! (Defaults to Celsius)')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('The location to get the weather for')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('unit')
                .setDescription('Unit of temperature (C or F)')
                .setRequired(false)
                .addChoices(
                    { name: 'Celsius', value: 'C' },
                    { name: 'Fahrenheit', value: 'F' }
                )
        ),
    advancedHelp: {
        details: 'This command retrieves and displays the current weather forecast for a specified location. When a user invokes this command and provides a location, the bot fetches the latest weather data, including temperature, humidity, wind conditions, and more, and presents it in an easy-to-read format. This is particularly useful for users who want quick access to weather information without leaving Discord. Next time you need to check the weather, just use this command!',
        usage: '/weather <location> [unit]',
        examples: [
            '/weather New York',
            '/weather Tokyo F',
        ],
    },    
    async execute(interaction) {
        const location = interaction.options.getString('location');

        weather.find({ search: location, degreeType: interaction.options.getString('unit') || 'C' }, async function (err, result) {
            if (err) {
                console.error('Weather CMD error:', err);
                await interaction.reply({ content: 'Error fetching weather data.', ephemeral: true }).catch(() => { });
                return;
            }

            if (!result || result.length === 0) {
                const errEmbed = new EmbedBuilder()
                    .setColor(0xff2727)
                    .setDescription(`:warning: **${interaction.user.username}**, please enter a valid location.`)
                    .setFooter({ text: 'API Latency is ' + `${Date.now() - interaction.createdTimestamp}` + ' ms' });

                await interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(() => { });
                return;
            }

            const current = result[0].current;
            const loc = result[0].location;

            console.log(current.imageUrl);

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${current.skytext} weather in ${current.observationpoint}`, iconURL: current.imageUrl })
                .setColor('Green')
                .addFields(
                    { name: 'Timezone', value: `UTC${loc.timezone}`, inline: true },
                    { name: 'Degree Type', value: loc.degreetype, inline: true },
                    { name: 'Temperature', value: `${current.temperature} Degrees`, inline: true },
                    { name: 'Feels Like', value: `${current.feelslike} Degrees`, inline: true },
                    { name: 'Winds', value: current.winddisplay, inline: true },
                    { name: 'Humidity', value: `${current.humidity}%`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'API Latency is ' + `${Date.now() - interaction.createdTimestamp}` + ' ms' });

            await interaction.reply({ embeds: [embed] }).catch(() => { });

            // fetch the sent message and react to it (can't react directly on interaction)
            const sent = await interaction.fetchReply().catch(() => null);
            if (sent && sent.react) await sent.react('👌').catch(() => { });
        });
    },
};

/*
module.exports.run = async (client, message, args, prefix, db) => {
    weather.find({ search: args.slice().join(' '), degreeType: 'C' }, function (err, result) { 
        if (err) console.log('Weather CMD error: ' + err);
        if (result === undefined || result.length === 0) {
            message.channel.send({
                embed: {
                    color: 0xff2727,
                    description: `:warning: **${message.author.username}**, please enter a valid location.`,
                    footer: {
                        text: 'API Lantancy is ' + `${Date.now() - message.createdTimestamp}` + ' ms',
                    }
                }
            });
            return;
        }

        var current = result[0].current;
        var location = result[0].location;

        let embed = new Discord.MessageEmbed()
            .setAuthor(`${current.skytext} weather in ${current.observationpoint}`, current.imageUrl)
            .setColor("GREEN")
            .addField('Timezone', `UTC${location.timezone}`, true)
            .addField('Degree Type', location.degreetype, true)
            .addField('Temperature', `${current.temperature} Degrees`, true)
            .addField('Feels Like', `${current.feelslike} Degrees`, true)
            .addField('Winds', current.winddisplay, true)
            .addField('Humidity', `${current.humidity}%`, true);
        message.channel.send({ embed });
        return message.react("👌");
    });
};



module.exports.help = {
    name: 'weather',
    description: 'see your current forecast with this command!',
}
*/