const { SlashCommandBuilder, InteractionCollector } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dasclasses')
    .setDescription('Replies with requested Class'),
  async execute(interaction) {
    const classData = await fetch('https://www.dnd5e.co/api/classes/#');

    

    await interaction.reply('enter data here')
  }
}