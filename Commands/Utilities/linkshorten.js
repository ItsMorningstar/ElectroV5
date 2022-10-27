const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "link-shorten",
  description: "Shorten any URL link.",
  cooldown: "7000",
  options: [
    {
      name: "long-link",
      description: "The URL you want to shorten.",
      type: "STRING",
      required: true,
    },
  ],

  async execute(client, interaction) {
    const uri = interaction.options.getString("long-link");
    const { BitlyClient } = require("bitly");
    const bitly = new BitlyClient(
      "be399be2a029582c31001119e165e91544adf827",
      {}
    );

    let result;
    try {
      result = await bitly.shorten(uri);
      const shortLink = new MessageEmbed()
        .setTitle("Your Short Link")
        .setDescription(result.link)
        .setColor(client.color);
      await interaction.reply({ embeds: [shortLink], ephemeral: true });
    } catch (e) {
      await interaction.reply({
        content: `${client.emotes.no} Please enter a valid URL.`,
        ephemeral: true,
      });
      console.log(e);
    }
    return result;
  },
};
