// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Intents } = require("discord.js");
const { token } = require("./config.json");

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

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log("Ready!");

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

      awake.sort();
      const res = [
        "# SLEEP",
        line,
        "",
        ...awake.map((a) => a.split(" ").slice(1).join(" ")),
      ];
      channel.send(res.join("\n"));
    } else {
      channel.send("Congrats! 🥳 Everyone slept on time!");
    }
  });
});

client.on("messageCreate", async (message) => {
  if (message.member.user.bot) return;

  message.react("😴");
  message.reply("Go to Sleep Please! 🥺");
});

// Log in to Discord with your client's token
client.login(token);
