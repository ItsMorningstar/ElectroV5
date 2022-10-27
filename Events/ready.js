const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ready",
  async execute(client) {

    client.version = "V5.2.3";
    client.user.setPresence({ activities: [{ name: "V6.0.0 RELEASING ON 21st" }], status: 'idle' });

    require("../functions/handleCommands")(client);
    require("../functions/dbLogin")(client);
    require("../functions/handleGiveaways")(client);
    require("../functions/handleCooldowns")(client);
    require("../functions/handleErrors")(client);

    client.devs = ["769851017172746251", "536596970236805143"];
    client.color = "#0303ff";
    client.invite = "https://discord.com/api/oauth2/authorize?client_id=931583578314268672&permissions=8&scope=bot%20applications.commands";
    client.server = "https://discord.gg/XBYMMqWamb";
    client.site = "https://electrobot.xyz";

    client.emotes = {
      ok: "<a:ElectroCheck:1031213301897646101>",
      no: "<a:ElectroDeny:1031217781921812570",
      loading: "<a:ElectroLoading:955863470371405885>",
      party: "<a:ElectroGiveaway:955863477216481291>",
      gift: "<a:ElectroGift:955863479355576431>",
      dot: "<a:ElectroBullet:955863473873633361>",
      ticket: "<:ElectroTicket:955863468647534673>",
      reply: "<:ElectroReply:955863465539547156>",
      memberCount: "<:ElectroMember:955863454017802280>",
    };

    client.devOnly = new MessageEmbed()
      .setColor(client.color)
      .setDescription(`${client.emotes.no} This is a developer only command.`);
  
      await client.channels.cache.get("955738417512218624").send("Connected to discord.");
  },
};
