const { embedBuilder } = require("discord.js");
const axios = require("axios");
const { EmbedBuilder } = require("@discordjs/builders");

const buildSpellDmgCard = (spell) => {
  const spellCard = new EmbedBuilder()
    .setTitle(spell.name)
    .setDescription("Damage and D/C checks");

  spellCard.addFields({
    name: "CASTING TIME",
    value: spell.casting_time.toString(),
  });

  if (spell.attack_type)
    spellCard.addFields({
      name: "ATTACK TYPE",
      value: spell.attack_type.toString(),
    });

  if (spell.area_of_effect)
    spellCard.addFields({
      name: "Area of Effect",
      value: `${spell.area_of_effect.size} ft. ${spell.area_of_effect.type}`,
    });

  if (spell.dc)
    spellCard.addFields(
      { name: "DC Type", value: spell.dc.dc_type.name, inline: true },
      { name: "DC Success", value: spell.dc.dc_success, inline: true }
    );

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
