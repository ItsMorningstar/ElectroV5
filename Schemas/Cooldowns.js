const { model, Schema } = require("mongoose");

module.exports = model(
  "Cooldown",
  new Schema({
    Details: String,
    Time: String,
  })
);