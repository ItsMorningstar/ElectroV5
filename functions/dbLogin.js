const mongoose = require('mongoose')
module.exports = () => {

mongoose.connection.on("connected", () => console.log("✅ Connected to database."));
mongoose.connection.on("disconnected", () => console.log("🔌 Disconnected from database."));
mongoose.connection.on("error", (error) => console.log('❌ ' + error));
return mongoose.connect(process.env.dbToken);
};