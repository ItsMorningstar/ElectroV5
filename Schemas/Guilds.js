const mongoose = require("mongoose");
const guildModel = new mongoose.Schema({
    
  guildId: {
    type: String,
    unique: true,
    required: true,
  },

  logChannel: {
    type: String,
    unique: true,
  },

  aiChannel: {
    type: String,
    unique: true,
  },

  ticketSetup: {
    channel: String,
    category: String,
    transcripts: String,
    handlers: String,
    everyone: String,
  },

  notifications: {
    channel: String,
    youtube: String,
  },
});
const model = mongoose.model("guilds", guildModel);
module.exports = model;
