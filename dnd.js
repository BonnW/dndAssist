const { Client } = require("discord.js");
require("dotenv").config();

const client = new Client();

client.once("ready", () => {
  console.log("bot live");
});

client.login(process.env.TOKEN);
