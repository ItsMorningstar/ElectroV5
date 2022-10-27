const { Perms } = require("../Validation/Permissions");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);

module.exports = async (client) => {
// Set Commands
    CommandsArray = [];

    (await PG(`${process.cwd()}/Commands/**/*.js`)).map(async (file) => {
      const command = require(file);
  
      if (!command.name) return console.log(`${file} has no name.`);
      if (!command.description) return console.log(`${file} has no description.`);
  
      if (command.permission) {
        if (Perms.includes(command.permission)) command.defaultPermission = false;
        else return console.log(`${file} has an invalid permission.`);
      }
  
      client.commands.set(command.name, command);
      CommandsArray.push(command);
    });
    console.log("✅ Commands");
  
};
