const { SlashCommandBuilder, InteractionCollector } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dasclasses')
    .setDescription('Replies with requested Class'),
  async execute(interaction) {
    axios.get('https://www.dnd5eapi.co/api/classes/#')
    
    await interaction.reply('enter data here')
  }
}