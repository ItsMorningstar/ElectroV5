const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const db = require("../../Schemas/Guilds");

module.exports = {
  name: "notify",
  description: "Notify the server whenever you upload a video / stream to youtube or twitch.",
  permission: "MANAGE_CHANNELS",
  cooldown: "3000",
  options: [
    {
      name: "youtube",
      description:
        "Notify the server whenever you upload a video / stream to youtube.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "notify_channel",
          description:
            "The channel where the video notifications will be posted.",
          type: "CHANNEL",
          required: true,
        },
        {
          name: "youtube_link",
          description:
            "The Youtube channel link.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "twitch",
      description: "Notify the server whenever you're streaming on Twitch.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "notify_channel",
          description:
            "The channel where the live notifications will be posted.",
          type: "CHANNEL",
          required: true,
        },
        {
          name: "twitch_link",
          description:
            "The Twitch channel link.",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],

  async execute(client, interaction) {
    const i = interaction;
    if (!client.devs.includes(interaction.user.id))
      return await interaction.reply({
        embeds: [client.devOnly],
        ephemeral: true,
      });

    if (i.options.getSubcommand() === "youtube") {
      const channel = i.options.getChannel("notify_channel");
      const link = i.options
        .getString("youtube_link")
        .replace("https://www.youtube.com/channel/", "")
        .replace("https://www.youtube.com/c/", "")
        .replace("youtube.com/channel/", "")
        .replace("youtube.com/c/", "");

      await db.updateOne(
        { guildId: interaction.guild.id },
        {
          notifications: {
            channel: channel.id,
            youtube: link,
          },
        },
        {
          upsert: true,
        }
      );

      const ok = new MessageEmbed()
        .setColor(client.color)
        .setDescription(
          `${client.emotes.ok} Alright, I'll notify all in ${channel} whenever the channel uploads or live stream.`
        );
      await interaction.reply({
        embeds: [ok],
        ephemeral: false,
      });
    }
  },
};
