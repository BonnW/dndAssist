const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const axios = require("axios"); // need to remove and change to fetch

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log("bot live");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "server") {
    await interaction.reply("Server info.");
  } else if (commandName === "user") {
    await interaction.reply("User info.");
  } else if (commandName === "dasmonsters") {
    axios
      .get("https://www.dnd5eapi.co/api/monsters/adult-black-dragon")
      .then((res) => {
        interaction.reply(
          `**${res.data.name}** \n ${res.data.type} \n ${res.data.alignment}`
        );
        // console.log(res);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }
});

client.login(process.env.TOKEN);
