const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config();
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const rest = new REST({ version: '10' }).setToken(token);

rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1001942044975050794'))
  .then(() => console.log('deleted 1 slash command'))
  .catch(console.error);

rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1001942044975050793'))
  .then(() => console.log('deleted 1 slash command'))
  .catch(console.error);

rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1001942044975050795'))
  .then(() => console.log('deleted 1 slash command'))
  .catch(console.error);
