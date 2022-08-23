const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

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

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isButton()) return;
    const searchItem = interaction.message.content;
    console.log(searchItem);
    await axios
      .get(`https://www.dnd5eapi.co/api/monsters/${searchItem}`)
      .then((res) => {
        const monster = res.data;
        interaction.reply({ embeds: [buildActionCard(monster)] });
      })
      .catch((err) => {
        console.log(err);
        interaction.reply({
          content: `Error Getting Monster Actions of ${searchItem}`,
        });
      });
  },
};
