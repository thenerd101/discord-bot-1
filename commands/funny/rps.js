const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('A rock paper scissors playing command!'),
    advancedHelp: {
        details: 'This command allows you to play a game of Rock, Paper, Scissors against the bot. When you invoke this command, the bot will prompt you to react with your choice of rock, paper, or scissors using emojis. After you make your selection, the bot will randomly choose its own option and then determine the winner based on the classic rules of the game. It\'s a fun and interactive way to challenge the bot and see if you can outsmart it! Next time you want to play a quick game of Rock, Paper, Scissors, just use this command!',
        usage: '/rps',
        examples: [
            '/rps',
        ],
    },
    async execute(interaction) {
        let embed = new EmbedBuilder()
            .setTitle("RPS GAME")
            .setDescription("React to play!")
            .setTimestamp()
        let msg =  await interaction.reply({ embeds: [embed], fetchReply: true })
        await msg.react("🗻")
        await msg.react("✂")
        await msg.react("📰")
        const filter = (reaction, user) => {
            return ['🗻', '✂', '📰'].includes(reaction.emoji.name) && user.id === interaction.user.id;
        }
        const choices = ['🗻', '✂', '📰']
        const me = choices[Math.floor(Math.random() * choices.length)]
        msg.awaitReactions({ filter, max:1, time: 60000, errors: ["time"]}).then(
        	async(collected) => {
                const reaction = collected.first()
        		let result = new EmbedBuilder()
        		.setTitle("RESULT")
                .addFields(
                    { name: "Your choice", value: `${reaction.emoji.name}` },
                    { name: "My choice", value: `${me}` }
                )
            await msg.edit({ embeds: [result] })
            if ((me === "🗻" && reaction.emoji.name === "✂") ||
                (me === "📰" && reaction.emoji.name === "🗻") ||
                (me === "✂" && reaction.emoji.name === "📰")) {
                    interaction.followUp("You lost!");
            } else if (me === reaction.emoji.name) {
                return interaction.followUp("It's a tie!");
            } else {
                return interaction.followUp("You won!");
            }
        })
        .catch(collected => {
                interaction.followUp('Process has been cancelled since you did not respond in time!');
            }
        )
    },
};




/*
module.exports.run = async (client, message, args, prefix, db) => {
    let embed = new discord.MessageEmbed()
		.setTitle("RPS GAME")
		.setDescription("React to play!")
		.setTimestamp()
		let msg = await message.channel.send(embed)
		await msg.react("🗻")
		await msg.react("✂")
		await msg.react("📰")

		const filter = (reaction, user) => {
            return ['🗻', '✂', '📰'].includes(reaction.emoji.name) && user.id === message.author.id;
        }

        const choices = ['🗻', '✂', '📰']
        const me = choices[Math.floor(Math.random() * choices.length)]
        msg.awaitReactions(filter, {max:1, time: 60000, error: ["time"]}).then(
        	async(collected) => {
        		const reaction = collected.first()
        		let result = new discord.MessageEmbed()
        		.setTitle("RESULT")
        		.addField("Your choice", `${reaction.emoji.name}`)
        		.addField("My choice", `${me}`)
			await msg.edit(result)
        		if ((me === "🗻" && reaction.emoji.name === "✂") ||
                (me === "📰" && reaction.emoji.name === "🗻") ||
                (me === "✂" && reaction.emoji.name === "📰")) {
                    message.reply("You lost!");
            } else if (me === reaction.emoji.name) {
                return message.reply("It's a tie!");
            } else {
                return message.reply("You won!");
            }
        })
        .catch(collected => {
                message.reply('Process has been cancelled since you did not respond in time!');
            })
}


module.exports.help = {
    name: 'rps',
    description: 'A rock paper scissors playing command!',
}
*/