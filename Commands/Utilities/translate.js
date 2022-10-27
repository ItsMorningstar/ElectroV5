const { MessageEmbed } = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
  name: "translate",
  description: "Translate a piece of text from a language to another.",
  cooldown: "7000",
  options: [
    {
      name: "language",
      description: "Language to translate TO.",
      type: "STRING",
      required: true,
    },
    {
      name: "text",
      description: "The text to be translated.",
      type: "STRING",
      required: true,
    },
  ],

  async execute(client, interaction) {
    const lang = interaction.options.getString("language");
    const text = interaction.options.getString("text");
    const iso = new MessageEmbed()
      .setColor(client.color)
      .setDescription(
        client.emotes.no +
          " The language must be in ISO language code.\nFor Example: English = `en`, Hindi = `hi`, French = `fr`"
      );

    translate(text, { to: lang })
      .then(async (res) => {
        const translation = new MessageEmbed()
          .setDescription(res.text)
          .setColor(client.color);
        await interaction.reply({ embeds: [translation], ephemeral: true });
      })
      .catch((e) => interaction.reply({ embeds: [iso], ephemeral: true }));
  },
};
