const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

  module.exports = {
    name: "stats",
    description: "View bot's live stats.",
    cooldown: "7000",
  async execute(client, interaction) {

    let embed = new MessageEmbed()
      .setTitle("__Electro Stats__")
      .setDescription(
        `**Electro ${client.version}**\n\n <:Online:955863466214846464> Online for **${client.guilds.cache.reduce((a,b) => a+b.members.cache.size,0)} Users** in **${client.guilds.cache.size} Servers**\n\n**Developer:** [Yoo_ItsMaster](https://discord.com/users/769851017172746251) \n**Troubleshooter:** [Pitzel](https://discord.com/users/536596970236805143)`
      )
      .setThumbnail("https://imgur.com/vinh8wH.png")
      .setTimestamp()
      .setColor(client.color);
    await interaction.reply({ embeds: [embed] });
  },
};
