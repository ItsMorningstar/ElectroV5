const { MessageActionRow, MessageButton } = require('discord.js');

  module.exports = {
    name: "invite",
    description: "Invite Electro to your server!",
    cooldown: "7000",
  async execute(client, interaction) {

    const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setURL(client.invite)
        .setLabel('Invite Now!')
        .setStyle('LINK'));
await interaction.reply({ content: client.emotes.dot, components: [row] });

  },
};
