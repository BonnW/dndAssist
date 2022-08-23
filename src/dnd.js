require("dotenv").config({ path: __dirname + "/../.env" });
const { token } = process.env;
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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

const savingThrows = (proficiencies) => {
  newFormat = proficiencies.reduce(
    (profSave, item) => (
      (profSave[item.proficiency.name] = item.value.toString()), profSave
    ),
    {}
  );

  return newFormat;
};

const buildActionCard = (monster) => {
  const actionCard = new EmbedBuilder()
    .setTitle(monster.name)
    .setDescription(`${monster.size} ${monster.type}, ${monster.alignment}`);
};

const buildStatCard = (monster) => {
  const monsterSaves = savingThrows(monster.proficiencies);
  console.log(monster);
  // console.log(monsterSaves);
  const embedCard = new EmbedBuilder()
    .setTitle(monster.name)
    .setDescription(`${monster.size} ${monster.type}, ${monster.alignment}`);

  // for (const save of monsterSaves) {
  // console.log(save);
  // }

  embedCard.addFields(
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
      value: `Walk: ${monster.speed.walk.toString()} Swim: ${monster.speed.swim.toString()}`,
      inline: true,
    },
    {
      name: "\u200B",
      value: "\u200B",
    },
    {
      name: "PRIMARY ATTRIBUTES",
      value: "---------------",
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
    },
    {
      name: "SKILL SAVES",
      value: "---------------",
    }
  );

  for (const key in monsterSaves) {
    embedCard.addFields({
      name: key,
      value: "+" + monsterSaves[key].toString(),
      inline: true,
    });
  }

  // monster.actions.map((action) => {
  //   embedCard.addFields({ name: action.name, value: action.desc });
  // });
  // if (monster.legendary_actions) {
  //   embedCard.addFields({
  //     name: "LEGENDARY ACTIONS",
  //     value: "---------------",
  //   });
  //   monster.legendary_actions.map((action) => {
  //     embedCard.addFields({ name: action.name, value: action.desc });
  //   });
  // }

  return embedCard;
};

client.on("interactionCreate", (interaction) => {
  if (!interaction.isButton()) return;
  console.log(interaction.message.content);
});

client.on("messageCreate", async (message) => {
  const channel = client.channels.cache.get(message.channelId);

  const orders = message.content.split(" ");
  const orderStart = orders.shift();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("primary")
      .setLabel("Get Monster Actions")
      .setStyle(ButtonStyle.Primary)
  );

  if (message.content === "ping") {
    await channel.send({ content: "pong" });
  }

  if (orderStart === "da") {
    await axios
      .get(`https://www.dnd5eapi.co/api/monsters/${orders.join("-")}`)
      .then((res) => {
        const monster = res.data;

        channel.send({
          content: orders.join("-"),
          embeds: [buildStatCard(monster)],
          components: [row],
        });
      })
      .catch((err) => {
        console.log(err);
        channel.send({ content: "monster not found" });
      });
  }
});

client.login(token);
