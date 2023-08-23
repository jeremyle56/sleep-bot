// Require the necessary discord.js classes
const {
  Client,
  Collection,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
} = require("discord.js");
const { token } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");

const { phrases } = require("./phrases.json");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! ${c.user.tag} is online`);

  client.guilds.cache.forEach((g) => {
    const awake = [];
    g.presences.cache.forEach((m) => {
      if (m.userId === "1143401901027754004") return;
      const userId = m.userId;
      const user = g.members.cache.get(userId);
      const name = user.nickname || user.user.globalName || user.user.username;

      const activities = m.activities.map((a) => a.name);
      let message = activities.sort().join(" + ");
      message = message ? `: Playing ${message}` : "";

      awake.push(`${name} <@${userId}>${message}`.trim());
    });

    const channel = g.channels.cache.find((p) => p.name === "sleep");
    if (awake.length) {
      const line = phrases[parseInt(Math.random() * phrases.length)];

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("SLEEP!")
        .setDescription(line);

      awake.sort();
      const res = awake.map((a) => a.split(" ").slice(1).join(" "));

      channel.send({ content: res.join("\n"), embeds: [embed] });
    } else {
      channel.send("Congrats! 🥳 Everyone slept on time!");
    }
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.member.user.bot) return;

  message.react("😴");
  message.reply("Go to Sleep Please! 🥺");
});

// Log in to Discord with your client's token
client.login(token);
