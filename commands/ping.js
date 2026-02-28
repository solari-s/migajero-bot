const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "ping",

    async execute(message, args, client) {
        // Mensaje inicial para medir latencia
        const sent = await message.channel.send("Calculando ping...");

        const botLatency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        const embed = new EmbedBuilder()
            .setDescription(`🏓 Pong!\n📡 Latencia del bot: ${botLatency}ms\n🌐 Latencia API: ${apiLatency}ms`)
            .setColor("Purple");

        await sent.edit({ content: null, embeds: [embed] });
    }
};