const { model, Schema } = require('mongoose')

module.exports = model('devas', new Schema({

    Blacklist: String,
    ServersBlacklist: [String],
    UsersBlacklist: [String],

}));