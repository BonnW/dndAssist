const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

const buildClassCard = (dndClass) => {
  const classCard = new EmbedBuilder().setTitle(dndClass.name);

  classCard.addFields(
    {
      name: "\u200B",
      value: "\u200B",
    },
    { name: "PROFICIENCIES", value: "---------------" }
  );

  dndClass.proficiencies.map((item) => {
    classCard.addFields({ name: item.name, value: "+", inline: true });
  });

  classCard.addFields(
    {
      name: "\u200B",
      value: "\u200B",
    },
    { name: "SKILL SAVES", value: "---------------" }
  );

  dndClass.saving_throws.map((item) => {
    classCard.addFields({ name: item.name, value: "+" });
  });

  return classCard;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daclass")
    .setDescription("Replies with requested Class")
    .addStringOption((option) =>
      option
        .setName("class")
        .setDescription("enter classname to search")
        .setRequired(true)
    ),
  async execute(interaction) {
    const className = interaction.options.getString("class");
    await axios
      .get(`https://www.dnd5eapi.co/api/classes/${className}`)
      .then((res) => {
        const dndClass = res.data;
        interaction.reply({
          content: `Got: ${dndClass.name}`,
          embeds: [buildClassCard(dndClass)],
        });
      })
      .catch((err) => {
        console.log(err);
        interaction.reply({ content: "GET request error" });
      });
  },
};
