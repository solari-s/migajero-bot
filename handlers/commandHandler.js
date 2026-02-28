const Guild = require('../models/Guild');

module.exports = async function handleCommands(message, client) {
    if (!message.guild) return;

    let guild = await Guild.findOne({ guildId: message.guild.id });
    const prefix = guild?.prefix || "!";

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    await command.execute(message, args, client);
};