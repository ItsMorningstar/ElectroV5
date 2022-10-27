const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "eval",
  description: "Developer Command.",
  cooldown: "3000",
  options: [
    {
      name: "code",
      description: "The Code to evaluate.",
      type: "STRING",
      required: true,
    },
  ],
  async execute(client, interaction) {
    if (!client.devs.includes(interaction.user.id))
      return await interaction.reply({
        embeds: [client.devOnly],
        ephemeral: true,
      });
  const embed = new MessageEmbed().addField(
    "Input",
    "```js\n" + interaction.options.getString("code") + "```"
    );

  try {
    const code = interaction.options.getString("code");
    let evaled = eval(code);

    if (typeof evaled !== "string")
      evaled = require("util").inspect(evaled, { depth: 0 });

    let output = clean(evaled);
    embed
      .addField("Result", "```js\n" + output + "```")
      .setColor(`#4efc03`);

    await interaction.reply({ embeds: [embed], ephemeral: true});
  } catch (error) {
    let err = clean(error);
    embed.addField("Error", "```js\n" + err + "```").setColor(`#ff0019`);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
  function clean(string) {
    if (typeof text === "string") {
      return string
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
      return string;
    }
  }
}
}