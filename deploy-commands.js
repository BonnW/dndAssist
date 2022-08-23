const fs = require("node:fs");
const path = require("node:path");
const { Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
require("dotenv").config();
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.token;

// note: did not run script yet -- DELETE THIS WHEN SCRIPT IS RUN
const commands = [];
const commandsPath = path.join(__dirname, "src", "commands");
console.log(commandsPath);
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);

// BELOW IS EXAMPLE OF COMMAND CREATION
// const commands = [
//   new SlashCommandBuilder()
//     .setName("ping")
//     .setDescription("Replies with pong!"),
//   new SlashCommandBuilder()
//     .setName("server")
//     .setDescription("Replies with server info!"),
//   new SlashCommandBuilder()
//     .setName("user")
//     .setDescription("Replies with user info!"),
// ].map((command) => command.toJSON());
