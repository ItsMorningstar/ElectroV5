const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "avatar",
  description: "Get the avatar of yourself or a user.",
  cooldown: "7000",
  options: [
    {
      name: "user",
      description: "The user whose avatar you need.",
      type: "USER",
      required: false,
    },
  ],

  async execute(client, interaction) {
    const member = interaction.options.getMember("user") || interaction.member;

    const avatar = new MessageEmbed()
      .setTitle(`${member.user.tag}'s Avatar`)
      .setColor(client.color)
      .setImage(
        member.displayAvatarURL({ format: "png", dynamic: true, size: 256 })
      );
    await interaction.reply({ embeds: [avatar] });
  },
};
