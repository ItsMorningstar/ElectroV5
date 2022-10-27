const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ban",
  description: "Ban a user from the server.",
  permission: "BAN_MEMBERS",
  cooldown: "3000",
  options: [
    {
      name: "user",
      description: "The user to ban.",
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
    const member = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason specified.";
    const banner = interaction.member.tag || interaction.user.tag;

    if (interaction.guild.members.cache.get(member)) {
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
      if (
        member.roles.highest.position >=
        interaction.member.roles.highest.position
      )
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
    }

    if (reason.length > 77)
      return interaction.reply({
        content:
          client.emotes.no +
          "The reason specified must be less then 77 characters.",
        ephemeral: true,
      });

    interaction.guild.bans.create(member, {
      reason: `By ${banner} - ${reason}`,
    });

    const success = new MessageEmbed()
      .setAuthor({
        name: "Alright",
        iconURL: "https://imgur.com/VtiU3Xh.png",
      })
      .setDescription(
        `__${client.users.cache.get(member.id).tag}__ was banned from the server. \n\n **Moderator:** ${interaction.member}\n **Reason:** ${reason}`
      )
      .setThumbnail(
        "https://media1.tenor.com/images/a252b64244796945dce8880d1164f05e/tenor.gif"
      )
      .setColor(client.color);
    await interaction.reply({ embeds: [success] });
  },
};
