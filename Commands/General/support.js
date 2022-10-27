const { MessageActionRow, MessageButton } = require('discord.js');

  module.exports = {
    name: "support",
    description: "Join Electro's support server for any type of help / support.",
    cooldown: "7000",
  async execute(client, interaction) {

    const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setURL(client.server)
        .setLabel('Support Server')
        .setStyle('LINK'));
await interaction.reply({ content: client.emotes.dot, components: [row] });

  },
};
