const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "leave",
  description: "Developer Command.",
  cooldown: "7000",
  options: [
    {
      name: "server",
      description: "Server ID",
      type: "STRING",
    },
  ],

  async execute(client, interaction) {
    if (!client.devs.includes(interaction.user.id))
      return await interaction.reply({
        embeds: [client.devOnly],
        ephemeral: true,
      });

    const server = interaction.options.getString("server");
    client.guilds.cache.get(server).leave()

    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(`${client.emotes.ok} Left`)
          .setColor(client.color),
      ],
    });
  },
};
