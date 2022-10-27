const {model, Schema} = require('mongoose')

module.exports = model('tickets', new Schema({

    guildID: String,
    memberID: String,
    channelID: String,
    claimedBy: String
}));