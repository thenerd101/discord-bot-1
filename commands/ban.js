const Discord = require('discord.js')



module.exports.run = async (client, message, args, db) => {
  const banReason = args.slice(1).join(' '); // Reason of the ban (Everything behind the mention)


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
             */
          if (user = message.author) {
              return message.reply('you cannot ban yourself!')
          } else member.ban({ reason: banReason, })

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
  permissions: 'BAN_MEMBERS',
};




    