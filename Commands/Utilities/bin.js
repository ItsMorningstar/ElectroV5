const { Permissions, MessageEmbed, Message } = require("discord.js");
const sourcebin = require("sourcebin");

module.exports = {
  name: "bin",
  description: "Source bin a text or code.",
  cooldown: "7000",
  options: [
    {
      name: "language",
      description: "language of code, if not specified default is TEXT.",
      type: "STRING",
      required: false,
    },
  ],

  async execute(client, interaction) {

    const filter = (msgs) => msgs.author.id == interaction.user.id;
    const title = "Electro Source Bin ";
    const language = interaction.options.getString("language") || "text";

    await interaction.reply({
      content: "`Please send the code / text to be bin.`",
      ephemeral: true
    });
    try {
    const collector = await interaction.channel
      .awaitMessages({
        filter,
        max: 1,
        time: 14000,
      })
      .catch((err) => {
        return collector.delete();
      });

    const content = collector.first().content;
      const bin = await sourcebin.create(
        [
          {
            content: content,
            language: language,
          },
        ],
        {
          title: title,
          description: `Bin by ${interaction.user.tag}`,
        }
      );
      await interaction.channel.send({
        content:
          ` <@${interaction.user.id}>\n` +
          client.emotes.loading +
          " Here's your sourcebin\n" +
          bin.url,
      });
    } catch (error) {
      return;
    }
  },
};
