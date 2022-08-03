const { SlashCommandBuilder, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
require("dotenv").config();
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

// note: did not run script yet -- DELETE THIS WHEN SCRIPT IS RUN
const commands = [
  new SlashCommandBuilder()
    .setName("dasmonsters")
    .setDescription("Replies with requested monster info!"),
  new SlashCommandBuilder()
    .setName("dasclasses")
    .setDescription("Replies with requested class info!"),
  new SlashCommandBuilder()
    .setName("dasspells")
    .setDescription("Replies with requested spell info!"),
].map((command) => command.toJSON());

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
  