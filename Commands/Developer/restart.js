const { MessageEmbed } = require("discord.js");
const { exec } = require('child_process');

module.exports = {
  name: "restart",
  description: "Developer Command.",
  cooldown: "7000",
  async execute(client, interaction) {
    if (!client.devs.includes(interaction.user.id))
      return await interaction.reply({ embeds: [client.devOnly], ephemeral: true  });

    await interaction.reply({ embeds: [new MessageEmbed().setDescription("Restarting... " + client.emotes.loading).setColor(client.color)] });
    await exec('pm2 restart electro');
}}
