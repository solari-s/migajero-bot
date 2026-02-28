require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');

const handleMessage = require('./handlers/messageHandler');
const Guild = require('./models/Guild');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Conectar a Mongo
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo conectado"))
    .catch(console.error);

// Comandos
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Evento: mensaje
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    // XP y roles
    await handleMessage(message, client);

    // Comandos
    // handleCommands está dentro de handleMessage para mantener modularidad
});

// Evento: bienvenida
client.on('guildMemberAdd', async (member) => {
    const guildConfig = await Guild.findOne({ guildId: member.guild.id });
    if (!guildConfig?.welcomeChannel) return;

    const channel = member.guild.channels.cache.get(guildConfig.welcomeChannel);
    if (!channel) return;

    channel.send(`Bienvenido ${member} a **${member.guild.name}** 🎉`);
});

client.login(process.env.TOKEN);