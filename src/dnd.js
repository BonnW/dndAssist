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
// console.log(client.commands);

const channel = client.once("ready", () => {
  console.log("bot live");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: "error" });
  }
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
    .setDescription(`${monster.size} ${monster.type}, ${monster.alignment}`)
    .addFields(
      { name: "\u200B", value: "\u200B" },
      { name: "ACTIONS", value: "---------------" }
    );

  monster.actions.map((action) => {
    actionCard.addFields({
      name: action.name,
      value: action.desc,
      inline: true,
    });
  });

  if (monster.special_abilities.length > 0) {
    actionCard.addFields(
      {
        name: "\u200B",
        value: "\u200B",
      },
      { name: "SPECIAL ABILITIES", value: "---------------" }
    );

    monster.special_abilities.map((sp) => {
      actionCard.addFields({ name: sp.name, value: sp.desc, inline: true });
    });
  }

  if (monster.legendary_actions.length > 0) {
    actionCard.addFields(
      {
        name: "\u200B",
        value: "\u200B",
      },
      {
        name: "LEGENDARY ACTIONS",
        value: "---------------",
      }
    );
    monster.legendary_actions.map((action) => {
      actionCard.addFields({ name: action.name, value: action.desc });
    });
  }

  return actionCard;
};

const buildStatCard = (monster) => {
  const monsterSaves = savingThrows(monster.proficiencies);
  // console.log(monster);
  // console.log(monsterSaves);
  const statCard = new EmbedBuilder()
    .setTitle(monster.name)
    .setDescription(`${monster.size} ${monster.type}, ${monster.alignment}`);

  // for (const save of monsterSaves) {
  // console.log(save);
  // }

  statCard.addFields(
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
      value: `Walk: ${monster.speed.walk.toString()} `,
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
    }
  );

  if (monster.proficiencies.length > 0) {
    statCard.addFields(
      {
        name: "\u200B",
        value: "\u200B",
      },
      { name: "SKILL SAVES", value: "---------------" }
    );
    for (const key in monsterSaves) {
      statCard.addFields({
        name: key,
        value: "+" + monsterSaves[key].toString(),
        inline: true,
      });
    }
  }

  return statCard;
};

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  const searchItem = interaction.message.content;
  // console.log(searchItem);
  const channel = client.channels.cache.get(interaction.message.channelId);

  await axios
    .get(`https://www.dnd5eapi.co/api/monsters/${searchItem}`)
    .then((res) => {
      const monster = res.data;
      // console.log(monster);
      channel.send({
        embeds: [buildActionCard(monster)],
      });
    });

  interaction.reply(`${searchItem} Actions Received`);
});

client.on("messageCreate", async (message) => {
  const channel = client.channels.cache.get(message.channelId);

  const orders = message.content.split(" ");
  const orderStart = orders.shift();

  if (orderStart !== "da") return;

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
