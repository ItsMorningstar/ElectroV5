const { MessageEmbed } = require("discord.js");
const { execute } = require("../Events/ready");

module.exports = async (client) => {
  const { cmdChannel, errChannel } = require("../config.json");
  const interaction = require("../Events/interactionCreate.js");

  const cmd = new MessageEmbed()
    .setColor(client.color)
    .setTitle(`/${interaction.commandName}`)
    .setDescription(
      "**Server:** " +
        interaction.guild.name +
        `\` [${interaction.guild.id}]\`` +
        "\n**User:** " +
        interaction.user.tag +
        `\` [${interaction.user.id}]\``
    );

  process.on("unhandledRejection", async (reason, promise) => {
    try {
      console.log("Unhandled Rejection / Catch \n\n❌ " + reason, promise);

      const embed = new MessageEmbed()
        .setColor("RED")
        .setTitle("⚠️ Unhandled Rejection")
        .setDescription("``` ❌ " + reason + "\n\n" + reason.stack + "```")
        .setTimestamp();

      await client.channels.cache
        .get(errChannel)
        .send({ embeds: [embed] })
        .catch(() => console.log("❌"));
    } catch (error) {
      console.log("❌");
    }
    await client.channels.cache.get(cmdChannel).send({ embeds: [cmd] });
  });



  process.on("uncaughtException", async (err, origin) => {
    try {
      console.log("Unhandled Exception / Catch \n\n❌ " + err, origin);

      const embed = new MessageEmbed()
        .setColor("RED")
        .setTitle("⚠️ Unhandled Exception")
        .setDescription("``` ❌ " + err + "\n\n" + origin + "```")
        .setTimestamp();

      await client.channels.cache
        .get(errChannel)
        .send({ embeds: [embed] })
        .catch(() => console.log("❌"));
    } catch (error) {
      console.log("❌");
    }
    await client.channels.cache.get(cmdChannel).send({ embeds: [cmd] });
  });


  
  process.on("multipleResolves", async (type, promise, reason) => {
    try {
      console.log("Multiple Resolves \n\n❌ " + type, promise, reason);

      const embed = new MessageEmbed()
        .setColor("RED")
        .setTitle("⚠️ Multiple Resolves")
        .setDescription("``` ❌ " + type + "\n\n" + reason + promise + "```")
        .setTimestamp();

      await client.channels.cache
        .get(errChannel)
        .send({ embeds: [embed] })
        .catch(() => console.log("❌"));
    } catch (error) {
      console.log("❌");
    }
    await client.channels.cache.get(cmdChannel).send({ embeds: [cmd] });
  });
};
