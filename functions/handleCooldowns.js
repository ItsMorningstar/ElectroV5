const CooldownsDB = require("../Schemas/Cooldowns");

module.exports = (client) => {
  CooldownsDB.find().then((documents) => {
    documents.forEach((doc) => {
      let timestamp = doc.Time - Date.now();
      let time = Math.floor(timestamp / 1000);

      if (time * 1000 <= 0) return doc.delete();

      client.cooldowns.set(doc.Details, doc.Time);

      setTimeout(async () => {
        client.cooldowns.delete(`${doc.Details}`);
        doc.delete();
      }, time * 1000);
    });
  });
};