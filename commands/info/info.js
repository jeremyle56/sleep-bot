const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Provides information about optimal sleep"),
  async execute(interaction) {
    return await interaction.reply(
      "Research suggest the ideal time to go to sleep is 10 p.m. But you should focus more on having a consistent schedule and routine when it comes to hitting the hay. It is recommended that you sleep at least 7 hours a night and up to 9 hours."
    );
  },
};
