const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kick a user from the server.",
  permission: "KICK_MEMBERS",
  cooldown: "3000",
  options: [
    {
      name: "user",
      description: "The user to be kicked.",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "The reason for banning.",
      type: "STRING",
      required: false,
    },
  ],

  async execute(client, interaction) {
    const reason =  interaction.options.getString("reason") || "No reason specified.";
    const member = interaction.guild.members.cache.get(interaction.options.getUser("user").id);
    if (!member)
      return interaction.reply({
        content: `${client.emotes.no} The user is not a member of this server.`,
        ephemeral: true,
      });
    const booster = new MessageEmbed()
      .setColor(client.color)
      .setDescription(
        `${client.emotes.no} This user is a server booster, the role is protected.\n You may just timeout/mute them.`
      );

    const high = new MessageEmbed()
      .setColor(client.color)
      .setDescription(
        `${client.emotes.no} That User is on same or higher role than yours.`
      );

    const higher = new MessageEmbed()
      .setColor(client.color)
      .setDescription(
        client.emotes.no +
          " That User is on a higher role than mine, Please Drag up the `Electro` Role."
      );

      if (!interaction.member.id == interaction.guild.ownerId && !member.roles) return interaction.reply({ embeds: [high], ephemeral: true });
    if (member.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.reply({
        embeds: [high],
        ephemeral: true,
      });

    if (
      member.roles.highest.position >=
      interaction.guild.me.roles.highest.position
    )
      return interaction.reply({
        embeds: [higher],
        ephemeral: true,
      });
    if (member.premiumSince)
      return interaction.reply({ embeds: [booster], ephemeral: true });

    if (reason.length > 77)
      return interaction.reply({
        content:
          client.emotes.no +
          "The reason specified must be less then 77 characters.",
        ephemeral: true,
      });

    await member.kick(`By ${interaction.user.tag} - ${reason}`);

    const success = new MessageEmbed()
      .setAuthor({
        name: "Alright",
        iconURL: "https://imgur.com/VtiU3Xh.png",
      })
      .setDescription(
        `**${client.users.cache.get(member.id).tag}** was kicked out of server. \n\n __**Moderator:**__ <@${interaction.member.id}>\n __**Reason:**__ ${reason}`
      )
      .setThumbnail(
        "https://media1.tenor.com/images/9f8bb51d0290543e2e2c5938b21309bf/tenor.gif"
      )
      .setColor(client.color);
    await interaction.reply({
      embeds: [success],
    });
  },
};
