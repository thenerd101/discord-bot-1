const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('ban a member!')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The member to ban')
        .setRequired(true)
      )
      .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the ban')
      ),
  advancedHelp: {
    details: 'This command allows administrators to ban a member from the Discord server. When a user with the appropriate permissions invokes this command and specifies a member to ban, the bot will remove that member from the server and optionally log the reason for the ban. This is useful for maintaining community standards and ensuring a safe environment for all members. Next time you need to ban a disruptive member, just use this command!',
    usage: '/ban [user] [reason]',
    examples: [
      '/ban @Troublemaker Spamming in channels',
      '/ban @User123',
    ],
  },
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const banReason = interaction.options.getString('reason') || 'No reason provided';
    if (!interaction.member.permissions.has("BAN_MEMBERS")) {
      return interaction.reply("you are not allowed to ban members!");
    }
    if (!member) return interaction.reply('you need to mention someone to ban!');
    if (interaction.user.id === member.id) return interaction.reply("you cannot ban yourself!");
    if (interaction.guild.ownerId === member.id) return interaction.reply('you cannot ban the owner!');
    if (!member.bannable) return interaction.reply("I cannot ban this member!");
    await member.ban({ reason: banReason });
    return interaction.reply(`member ${member} has been banned. Reason: ${banReason}`);
  }
}

/*


module.exports.run = async (client, message, args, db) => {
  const banReason = args.slice(1).join(' '); // Reason of the ban (Everything behind the mention)

  if (!message.member.hasPermission("KICK_MEMBERS")) {
    return message.reply("you are not allowed to ban members!")
  }

  const user = message.mentions.users.first();
        // If we have a user mentioned
    if (user) {
    // Now we get the member from the user
    const member = message.guild.members.resolve(user);
          // If the member is in the guild
      if (member) {
            /**
             * Ban the member
             * Make sure you run this on a member, not a user!
             * There are big differences between a user and a member
             * Read more about what ban options there are over at
             * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
             *
            if (message.author.id === member.id) {
              return message.reply('you cannot ban yourself!')
           } 
            member.ban({ reason: banReason, })

            .then(() => {
              // We let the message author know we were able to ban the person
              message.channel.send(`Successfully banned ${user.tag}! Reason: ${banReason}`);
            })
            .catch(err => {
                // An error happened
                // This is generally due to the bot not being able to ban the member,
                // either due to missing permissions or role hierarchy
              message.channel.send('I was unable to ban the member');
                // Log the error
              console.error(err);
            });
        } else {
            // The mentioned user isn't in this guild
          message.channel.send("That user isn't in this guild!");
        }
      } else {
          // Otherwise, if no user was mentioned
        message.channel.send("You didn't mention the user to ban!");
      }
}




module.exports.help = {
	name: 'ban',
	description: 'ban a member!',
  usage: '[mentioned member]',
};
*/



    