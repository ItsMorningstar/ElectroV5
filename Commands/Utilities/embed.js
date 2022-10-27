const { MessageEmbed, Message } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "embed",
  description: "Make a embed in quickest / easiest way ever.",
  timeout: "7000",
  options: [
    {
      name: "title",
      description: "Title of the embed.",
      type: "STRING",
      required: true,
    },
    {
      name: "footer",
      description: "Footer of the embed.",
      type: "STRING",
      required: false,
    },
    {
      name: "color",
      description: "Color of the embed.",
      type: "STRING",
      required: false,
    },
  ],

  async execute(client, interaction) {

    const embed = new MessageEmbed();
    const title = interaction.options.getString("title");
    const footer = interaction.options.getString("footer");
    const color = interaction.options.getString("color") || client.color;
    const filter = (msg) => msg.author.id == interaction.user.id;

    if (title) {
    if (title.length > 210)
      return await interaction.reply({
        content: `${client.emotes.no} + Length of Title must not be longer then 210 Characters.`,
        ephemeral: true,
      });
    await embed.setTitle(title);
    }

    if (!/^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/.test(color))
      return await interaction.reply({
        content:
          "That's not a valid hex color code, It MUST be in `#ffffff` format.\n You may pick the color from here [Color Picker](https://www.google.com/search?q=color+picker)",
        ephemeral: true,
      });
    await embed.setColor(color);

    if (footer) {
      if (footer.length > 1400)
        return await interaction.reply({
          content: `${client.emotes.no} + Length of Footer must not be longer then 1400 Characters.`,
          ephemeral: true,
        });
      embed.setFooter({ text: footer });
    }

    await interaction.reply({
      content: "`Please send a description for the embed.`",
      ephemeral: true,
    });

    const collector = await interaction.channel
      .awaitMessages({
        filter,
        max: 1,
        time: 14000,
      })
      .catch((err) => {
        return collector.delete();
      });

    const description = collector.first().content;

    if (description.length > 4000)
      return await collector.reply({
        content: `${client.emotes.no} + Length of description must not be longer then 4000 Characters.`,
        ephemeral: true,
      });

    await embed.setDescription(description);

    await interaction.channel.send({ embeds: [embed] }).then(async (x) => {
      await x.reply({ content: `By: <@${interaction.user.id}>` });
    });
  },
};
