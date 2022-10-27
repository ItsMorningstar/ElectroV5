const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "help",
  description: "Quick guide of bot's commands",
  cooldown: "7000",
  async execute(client, interaction) {
    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("config")
        .setLabel("⚙️ Configuration")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("mod")
        .setLabel("🔨 Moderation")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("control")
        .setLabel("⛔ Server Control")
        .setStyle("PRIMARY")
    );
    const buttons2 = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("general")
        .setLabel("✌🏻 General")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("giveaway")
        .setLabel("🎉 Giveaways")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("tickets")
        .setLabel("🎫 Tickets")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("utility")
        .setLabel("🖥️ Utilities")
        .setStyle("PRIMARY"),
    );
    const buttons3 = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("config")
        .setLabel("⚙️ Configuration")
        .setStyle("PRIMARY")
        .setDisabled(true),
      new MessageButton()
        .setCustomId("mod")
        .setLabel("🔨 Moderation")
        .setStyle("PRIMARY")
        .setDisabled(true),
      new MessageButton()
        .setCustomId("control")
        .setLabel("⛔ Server Control")
        .setStyle("PRIMARY")
        .setDisabled(true)
    );
    const buttons4 = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("general")
        .setLabel("✌🏻 General")
        .setStyle("PRIMARY")
        .setDisabled(true),
      new MessageButton()
        .setCustomId("giveaway")
        .setLabel("🎉 Giveaways")
        .setStyle("PRIMARY")
        .setDisabled(true),
      new MessageButton()
        .setCustomId("tickets")
        .setDisabled(true)
        .setLabel("🎫 Tickets")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("utility")
        .setLabel("🖥️ Utilities")
        .setStyle("PRIMARY")
        .setDisabled(true)
    );
    const general = new MessageEmbed()
      .setColor(client.color)
      .setTitle("✌🏻 General")
      .setDescription(
        "・ `/invite`\n<:ElectroReply:955863465539547156> Invite the bot to any server.\n\n ・ `/support`\n<:ElectroReply:955863465539547156> Join Electro's Support Server.\n\n・ `/docs`\n<:ElectroReply:955863465539547156> Electro's Documentation, get a detailed info about every bot command.\n\n ・ `/stats`\n<:ElectroReply:955863465539547156> View Elecrto's live stats.\n\n" +
          `**[Invite Electro](${client.invite}) ・ [Support Server](${client.server}) ・ [Website](${client.site}) **`
      );

    const control = new MessageEmbed()
      .setColor(client.color)
      .setTitle("⛔ Server Control")
      .setDescription(
        "・ `/lock`\n<:ElectroReply:955863465539547156> Lock a channel / category for @everyone.\n\n ・ `/unlock`\n<:ElectroReply:955863465539547156> Unlock a channel / category for @everyone.\n\n ・ `/private`\n<:ElectroReply:955863465539547156> Private a channel / category for @everyone from viewing.\n\n ・ `/unprivate`\n<:ElectroReply:955863465539547156> Publicize a channel / category to @everyone.\n\n ・ `/webhooks-delete`\n<:ElectroReply:955863465539547156> Delete all webhooks from the server.\n\n" +
          `**[Invite Electro](${client.invite}) ・ [Support Server](${client.server}) ・ [Website](${client.site}) **`
      );

    const mod = new MessageEmbed()
      .setColor(client.color)
      .setTitle("🔨 Moderation")
      .setDescription(
        "・ `/purge`\n<:ElectroReply:955863465539547156> Delete a specific amount of messages from a channel or user.\n\n ・ `/slowmode`\n<:ElectroReply:955863465539547156> Enable slowmode in a channel for @everyone.\n\n ・ `/mute`\n<:ElectroReply:955863465539547156> Timeout any user for specified time.\n\n ・ `/kick`\n<:ElectroReply:955863465539547156> Kick a member out from server.\n\n・ `/ban`\n<:ElectroReply:955863465539547156> Ban a user from entering the server ever.\n\n・ `/unban`\n<:ElectroReply:955863465539547156> Unban a user who is banned from server.\n\n" +
          `**[Invite Electro](${client.invite}) ・ [Support Server](${client.server}) ・ [Website](${client.site}) **`
      );

    const config = new MessageEmbed()
      .setColor(client.color)
      .setTitle("⚙️ Configuration")
      .setDescription(
        "・ `/updates-channel`\n<:ElectroReply:955863465539547156> Set a channel where the bot will send the info about latest updates.\n\n・ `/chat-ai`\n<:ElectroReply:955863465539547156> Use Electro as a chatbot in channel.\n\n ・ `/reaction-roles`\n<:ElectroReply:955863465539547156> Setup reaction roles in a channel quicker and better.\n\n・ `/log-messages`\n<:ElectroReply:955863465539547156> Log deleted messages of server in a specific channel for moderation purpose.\n\n" +
          `**[Invite Electro](${client.invite}) ・ [Support Server](${client.server}) ・ [Website](${client.site}) **`
      );
    const giveaway = new MessageEmbed()
      .setColor(client.color)
      .setTitle("🎉 Giveaways")
      .setDescription(
        "・ `/giveaway create`\n<:ElectroReply:955863465539547156> Create a giveaway for your members.\n\n ・ `/giveaway reroll`\n<:ElectroReply:955863465539547156> Reroll & Select a different winner for a ended giveaway.\n\n ・ `/giveaway end`\n<:ElectroReply:955863465539547156> End a giveaway before time set.\n\n ・ `/giveaway cancel`\n<:ElectroReply:955863465539547156> Cancel any existing giveaway and refrain from choosing a winner.\n\n" +
          `**[Invite Electro](${client.invite}) ・ [Support Server](${client.server}) ・ [Website](${client.site}) **`
      );

    const tickets = new MessageEmbed()
      .setColor(client.color)
      .setTitle("🎟️ Tickets System")
      .setDescription(
        "・ `/ticket setup`\n<:ElectroReply:955863465539547156> Setup a ticket system in the server.\n\n ・ `/ticket add-remove`\n<:ElectroReply:955863465539547156> Add or Remove a member to/from the existing ticket.\n\n ・ `/ticket claim`\n<:ElectroReply:955863465539547156> Claim a ticket.\n\n ・ `/ticket rename`\n<:ElectroReply:955863465539547156> Rename a ticket.\n\n ・ `/ticket close`\n<:ElectroReply:955863465539547156> Close a existing ticket.\n\n" +
          `**[Invite Electro](${client.invite}) ・ [Support Server](${client.server}) ・ [Website](${client.site}) **`
      );

    const utility = new MessageEmbed()
      .setColor(client.color)
      .setTitle("🖥️ Utilities")
      .setDescription(
        "・ `/membercount`\n<:ElectroReply:955863465539547156> View the membercount of server.\n\n ・ `/avatar`\n<:ElectroReply:955863465539547156> View your / a member's avatar.\n\n ・ `/whois`\n<:ElectroReply:955863465539547156> View info about yourself / a member.\n\n ・ `/serverinfo`\n<:ElectroReply:955863465539547156> View info about the server.\n\n ・ `/embed`\n<:ElectroReply:955863465539547156> Make a embed in the quickest way possible.\n\n ・ `/translate`\n<:ElectroReply:955863465539547156> Translate a piece of text from any lanuage to other.\n\n ・ `/link-shorten`\n<:ElectroReply:955863465539547156> Shortify a long link through bitly.\n\n ・ `/bin`\n<:ElectroReply:955863465539547156> Bin any code / text, through source bin.\n\n" +
          `**[Invite Electro](${client.invite}) ・ [Support Server](${client.server}) ・ [Website](${client.site}) **`
      );

    await interaction.reply({
      embeds: [general],
      components: [buttons, buttons2],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id == interaction.user.id,
      time: 21000,
    });
    collector.on("collect", async (i) => {
      i.deferUpdate();
      if (i.customId == "general") {
        await interaction.editReply({
          embeds: [general],
          components: [buttons, buttons2],
        });
      }
      if (i.customId == "control") {
        await interaction.editReply({
          embeds: [control],
          components: [buttons, buttons2],
        });
      }
      if (i.customId == "mod") {
        await interaction.editReply({
          embeds: [mod],
          components: [buttons, buttons2],
        });
      }
      if (i.customId == "config") {
        await interaction.editReply({
          embeds: [config],
          components: [buttons, buttons2],
        });
      }
      if (i.customId == "giveaway") {
        await interaction.editReply({
          embeds: [giveaway],
          components: [buttons, buttons2],
        });
      }
      if (i.customId == "tickets") {
        await interaction.editReply({
          embeds: [tickets],
          components: [buttons, buttons2],
        });
      }
      if (i.customId == "utility") {
        await interaction.editReply({
          embeds: [utility],
          components: [buttons, buttons2],
        });
      }
    });
    collector.on("end", async (i) => {
      await interaction.editReply({
        components: [buttons3, buttons4],
      });
    });
  },
};
