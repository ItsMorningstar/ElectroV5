const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "unban",
  description: "Unban a user from the server.",
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
    const member = interaction.options.getUser("user").id;
    const reason = interaction.options.getString("reason") || "No reason specified.";

    if (reason.length > 77)
      return interaction.reply({
        content:
          client.emotes.no +
          "The reason specified must be less then 77 characters.",
        ephemeral: true,
      });

    await interaction.guild.bans.remove(member, `By ${interaction.user.tag} - ${reason}`);
    const success = new MessageEmbed()
      .setAuthor({
        name: "Alright",
        iconURL: "https://imgur.com/VtiU3Xh.png",
      })
      .setDescription(
        `__${client.users.cache.get(member).tag}__ was unbanned from the server. \n\n **Moderator:** ${interaction.member}\n **Reason:** ${reason}`
      )
      .setThumbnail(
        "https://media1.tenor.com/images/a252b64244796945dce8880d1164f05e/tenor.gif"
      )
      .setColor(client.color);
    await interaction.reply({ embeds: [success] });
  },
};
