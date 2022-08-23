const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

const buildClassCard = (dndClass) => {
  const classCard = new EmbedBuilder().setTitle(dndClass.name);

  classCard.addFields({ name: "test field name", value: "test field value" });

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
    // const channel = client.channels.cache.get(interaction.channelId);
    const className = interaction.options.getString("class");
    console.log(interaction.channelId);
    await axios
      .get(`https://www.dnd5eapi.co/api/classes/${className}`)
      .then((res) => {
        const dndClass = res.data;
        // channel.send({ embed: [buildClassCard(dndClass)] });
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
