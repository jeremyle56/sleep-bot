# sleep-bot

A discord bot which pings online users and tells them to go to sleep.

## Set up

Add your discord bot's token in a file called `config.json` like so:

```json
{
  "token": "your-token-goes-here"
}
```

Make sure you have a text channel called `sleep`.

Run `node index.js` to start up the bot.

Optionally you could also add the `clientId`, `guildId` and `facts` keys to the `config.json` to enable `deploy-commands.js` and the `facts` slash command.
