const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const request = require("request");
const { facts } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fact")
    .setDescription("Provides up to 30 random facts")
    .addIntegerOption((option) =>
      option.setName("number").setDescription("number of facts")
    ),
  async execute(interaction) {
    const number = (await interaction.options.getInteger("number")) ?? 1;
    await request.get(
      {
        url: "https://api.api-ninjas.com/v1/facts?limit=" + number,
        headers: {
          "X-Api-Key": facts,
        },
      },
      function (error, response, body) {
        if (error) return interaction.error("Request failed:", error);
        else if (response.statusCode != 200)
          return interaction.error(
            "Error:",
            response.statusCode,
            body.toString("utf8")
          );
        else {
          const res = [];
          body = JSON.parse(body);
          for (const [index, element] of body.entries()) {
            res.push(`${index}. ${element.fact}`);
          }
          return interaction.reply(res.join("\n"));
        }
      }
    );
  },
};
