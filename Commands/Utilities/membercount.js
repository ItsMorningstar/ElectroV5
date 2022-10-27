const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "membercount",
  description: "Get the count of members in the server.",
  cooldown: "7000",

  async execute(client, interaction) {
    const mc = new MessageEmbed()
      .setColor(client.color)
      .setTitle("Members")
      .setDescription(
        `${client.emotes.memberCount} ${interaction.guild.memberCount}`
      )
      .setTimestamp();
    await interaction.reply({ embeds: [mc] });
  },
};
