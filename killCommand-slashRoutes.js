const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
require("dotenv").config();
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.token;

const rest = new REST({ version: "10" }).setToken(token);

rest
  .delete(
    Routes.applicationGuildCommand(clientId, guildId, "1002131798559576196")
  )
  .then(() => console.log("deleted 1 slash command"))
  .catch(console.error);

rest
  .delete(
    Routes.applicationGuildCommand(clientId, guildId, "1002131798559576195")
  )
  .then(() => console.log("deleted 1 slash command"))
  .catch(console.error);

rest
  .delete(
    Routes.applicationGuildCommand(clientId, guildId, "1002131798559576197")
  )
  .then(() => console.log("deleted 1 slash command"))
  .catch(console.error);
