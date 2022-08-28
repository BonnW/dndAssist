const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const axios = require("axios");

const buildSpellCard = (spell) => {
  const spellCard = new EmbedBuilder()
    .setTitle(spell.name)
    .setDescription(spell.desc.toString());

  spellCard.addFields(
    {
      name: "OVERCAST",
      value: spell.higher_level.toString(),
      inline: true,
    },
    {
      name: "RANGE",
      value: spell.range.toString(),
      inline: true,
    },
    {
      name: "DURATION",
      value: spell.duration.toString(),
      inline: true,
    }
  );

  return spellCard;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daspell")
    .setDescription("Replies with requested Spell")
    .addStringOption((option) =>
      option
        .setName("spell")
        .setDescription("enter spellname to search")
        .setRequired(true)
    ),
  async execute(interaction) {
    const spellName = interaction.options.getString("spell");
    const spellQuery = spellName.replace(/\s+/g, "-").toLowerCase();
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("spell")
        .setLabel("Get Spell Damage")
        .setStyle(ButtonStyle.Primary)
    );
    await axios
      .get(`https://www.dnd5eapi.co/api/spells/${spellQuery}`)
      .then((res) => {
        const spell = res.data;
        interaction.reply({
          content: spell.index,
          embeds: [buildSpellCard(spell)],
          components: [row],
        });
      })
      .catch((err) => {
        console.log(err);
        interaction.reply({ content: "error fetching spell" });
      });
  },
};
