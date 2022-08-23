const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const axios = require("axios");

const calcSaves = (proficiencies) => {
  newFormat = proficiencies.reduce(
    (profSave, item) => (
      (profSave[item.proficiency.name] = item.value.toString()), profSave
    ),
    {}
  );
  return newFormat;
};

const buildStatCard = (monster) => {
  const monsterSaves = calcSaves(monster.proficiencies);
  console.log(monsterSaves);
  const statCard = new EmbedBuilder()
    .setTitle(monster.name)
    .setDescription(`${monster.size} ${monster.type}, ${monster.alignment}`);

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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("damonster")
    .setDescription("Replies with requested monster")
    .addStringOption((option) =>
      option
        .setName("monster")
        .setDescription("enter monster name to search")
        .setRequired(true)
    ),
  async execute(interaction) {
    const monsterName = interaction.options.getString("monster");
    const query = monsterName.replace(/\s+/g, "-").toLowerCase();
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("monster")
        .setLabel("Get Monster Actions")
        .setStyle(ButtonStyle.Primary)
    );
    await axios
      .get(`https://www.dnd5eapi.co/api/monsters/${query}`)
      .then((res) => {
        const monster = res.data;
        interaction.reply({
          content: monster.index,
          embeds: [buildStatCard(monster)],
          components: [row],
        });
      })
      .catch((err) => {
        console.log(err);
        interaction.reply({ content: "GET Monster Stats request Error" });
      });
  },
};
