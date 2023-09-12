const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const bent = require("bent");
const { facts } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fact")
    .setDescription("Provides up to 30 random facts")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("number of facts between 1 and 30")
    ),
  async execute(interaction) {
    const number = (await interaction.options.getInteger("number")) ?? 1;
    if (number > 30) {
      return interaction.error(
        "Error: The number you entered is larger than 30."
      );
    }

    const getRequest = bent("https://api.api-ninjas.com/v1/", "GET", "string");
    const obj = await getRequest("facts?limit=" + number, null, {
      "X-Api-Key": facts,
    });

    const body = JSON.parse(obj);
    const res = body.map((a, b) => `${b + 1}. ${a.fact}`);
    return interaction.reply(res.join("\n"));
  },
};
