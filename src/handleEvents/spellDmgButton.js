const { embedBuilder } = require("discord.js");
const axios = require("axios");
const { EmbedBuilder } = require("@discordjs/builders");

const buildSpellDmgCard = (spell) => {
  const spellCard = new EmbedBuilder()
    .setTitle(spell.name)
    .setDescription("Damage and D/C checks");

  spellCard.addFields({ name: "testname", value: "testvalue" });

  return spellCard;
};

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isButton() || interaction.customId !== "spell") return;
    const spellQuery = interaction.message.content;
    await axios
      .get(`https://www.dnd5eapi.co/api/spells/${spellQuery}`)
      .then((res) => {
        const spell = res.data;
        interaction.reply({ embeds: [buildSpellDmgCard(spell)] });
      })
      .catch((err) => {
        console.log(err);
        interaction.reply({ content: "error on spell damage buttons" });
      });
  },
};
