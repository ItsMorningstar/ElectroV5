const { model, Schema } = require("mongoose");

module.exports = model("user",
  new Schema({
    Id: String,
    poll: Number,
  })
);