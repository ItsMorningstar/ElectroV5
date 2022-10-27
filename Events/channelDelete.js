const db = require("../Schemas/Tickets");

module.exports = {
  name: "channelDelete",
  async execute(client, channel) {
    const x = await db.findOne({ channelID: channel.id });
    if (!x) return;
    await db.deleteOne({ channelID: channel.id });
  },
};
