require("dotenv").config({ path: __dirname + "/../.env" });
const { token } = process.env;
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
} = require("discord.js");

const axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

const channel = client.once("ready", () => {
  console.log("bot live");
});

client.on("messageCreate", async (message) => {
  const channel = client.channels.cache.get(message.channelId);

  const orders = message.content.split(" ");
  const orderStart = orders.shift();

  // console.log(orders); (S.N.: This is a horrible/ugle solution, find something better me.)

  if (message.content === "ping") {
    await channel.send({ content: "pong" });
  }

  if (orderStart === "da") {
    axios
      .get(`https://www.dnd5eapi.co/api/monsters/${orders.join("-")}`)
      .then((res) => {
        console.log(res.data.armor_class);
        const monster = res.data;
        const embedCard = new EmbedBuilder()
          .setTitle(res.data.name)
          .setDescription(
            `${monster.size} ${monster.type}, ${monster.alignment}`
          )
          .addFields(
            {
              name: "Armor Class",
              value: monster.armor_class.toString(),
              inline: true,
            },
            {
              name: "Hit Points",
              value: monster.hit_points.toString(),
              inline: true,
            },
            {
              name: "Speed",
              value: monster.speed.walk.toString(),
              inline: true,
            },
            {
              name: "\u200B",
              value: "\u200B",
            },
            {
              name: "STR",
              value: monster.strength.toString(),
              inline: true,
            },
            {
              name: "DEX",
              value: monster.dexterity.toString(),
              inline: true,
            },
            {
              name: "CON",
              value: monster.constitution.toString(),
              inline: true,
            },
            {
              name: "INT",
              value: monster.intelligence.toString(),
              inline: true,
            },
            {
              name: "WIS",
              value: monster.wisdom.toString(),
              inline: true,
            },
            {
              name: "CHA",
              value: monster.charisma.toString(),
              inline: true,
            }
          );
        monster.actions.map((action) => {
          embedCard.addFields({ name: action.name, value: action.desc });
        });
        monster.legendary_actions.map((action) => {
          embedCard.addFields({ name: action.name, value: action.desc });
        });
        channel.send({ embeds: [embedCard] });
      });
  }
});

client.login(token);
