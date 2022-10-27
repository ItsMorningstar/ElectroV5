const { Events } = require("../Validation/EventNames");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);

module.exports = async (client) => {

  (await PG(`${process.cwd()}/Events/**/*.js`)).map(async (file) => {
    const event = require(file);
    
    if (!Events.includes(event.name) || !event.name) {
      const L = file.split("/");
      await console.log("❌ Invalid Event Name")
      return;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    };
  });
  console.log("✅ Events");
};
