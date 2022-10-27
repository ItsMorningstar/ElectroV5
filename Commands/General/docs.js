const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

  module.exports = {
    name: "docs",
    description: "A full guide on Electro in detail.",
    cooldown: "7000",
  async execute(client, interaction) {
    
    const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setURL(client.site + "/docs")
        .setLabel("Electro Documentation")
        .setStyle('LINK'));
await interaction.reply({ content: client.emotes.dot, components: [row] });

  },
};
