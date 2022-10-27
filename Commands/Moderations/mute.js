const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "mute",
  description: "Timeout a member a member for a specified amount of time.",
  permission: "MODERATE_MEMBERS",
  cooldown: "3000",
  options: [
    {
      name: "user",
      description: "The member to be timed out.",
      type: "USER",
      required: true,
    },
    {
      name: "duration",
      description: "How much time the member should be muted for.",
      type: "STRING",
      required: true,
    },
    {
      name: "reason",
      description: "The reason of timeout.",
      type: "STRING",
      required: false,
    },
  ],

  async execute(client, interaction) {
    const target = interaction.guild.members.cache.get(
      interaction.options.getMember("user").id
    );
    const duration = interaction.options.getString("duration");
    const timeInMs = ms(duration);
    const reason =
      interaction.options.getString("reason") || "No reason specified.";

      if (!interaction.member.id == interaction.guild.ownerId && !member.roles) return interaction.reply({ embeds: [high], ephemeral: true });
      
    if (
      target.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        content:
          client.emotes.no + " That User is on same or higher role than yours.",
        ephemeral: true,
      });
    if (
      target.roles.highest.position >=
      interaction.guild.me.roles.highest.position
    )
      return interaction.reply({
        content:
          client.emotes.no +
          " That User is on a higher role than mine, Please Drag up the `Electro` Role.",
        ephemeral: true,
      });
    if (reason.length > 77)
      return interaction.reply({
        content:
          client.emotes.no +
          "The reason specified must be less then 77 characters.",
        ephemeral: true,
      });
    if (!timeInMs || timeInMs <= 0)
      return await interaction.reply({
        content: client.emotes.no + "Please specify a valid time.",
        ephemeral: true,
      });
      const success = new MessageEmbed().setColor(client.color)
      .setDescription(
        `${client.emotes.ok} ${target} is now muted for  ${duration}.` +
          "\n\n`Moderator:` " + `<@${interaction.user.id}>` + "\n`Reason:` " + reason)


    if (target.roles.cache.has(["ADMINISTRATOR"])) {
      await interaction.reply({
        content:
          client.emotes.no +
          `The mentioned user is an Administrator, Do you still want them to be punished by mute ? \nThey will lose their administrator role, you may have to add manually.`,
      });

      const confirm = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Yes, mute them.")
          .setCustomId("yes")
          .setStyle("SUCCESS"),
        new MessageButton()
          .setLabel("No, skip")
          .setCustomId("no")
          .setStyle("DANGER")
      );
      const ended = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Yes, mute them.")
          .setCustomId("yes")
          .setStyle("SUCCESS")
          .setDisabled(true),
        new MessageButton()
          .setLabel("No, skip")
          .setCustomId("no")
          .setStyle("DANGER")
          .setDisabled(true)
      );

      const filter = (i) => i.user.id === interaction.user.id;
      const collector =
        await interaction.channel.createMessageComponentCollector({
          filter,
          time: 7000,
        });

      collector.on("collect", async (i) => {
        if (i.customId === "yes") {
          await i.deferUpdate();
          
          await target.timeout(timeInMs, `By ${interaction.user.tag}: ` + reason);
        }
        if (i.customId === "no") {
          await i.deferUpdate();
          await collector.stop()
        }
      });
      collector.on("end", async (collected) => {
        await interaction.editReply({
          components: [ended],
        });
      });
    }

    await target.timeout(timeInMs, `By ${interaction.user.tag}: ` + reason);

    await interaction.reply({ embeds: [success] })

      .catch((error) => interaction.reply("❌ " + error));
  },
};
