const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');

module.exports = {
    name: "rank",
    async execute(message, args, client) {
        if (!message.guild) return;

        // Usuario a consultar
        const target = message.mentions.members?.first() || message.member;

        // ordenados por XP
        const users = await User.find({ guildId: message.guild.id })
            .sort({ xp: -1 });

        if (!users.length) return message.reply("No hay datos todavía.");

        // Buscar la posición del usuario
        const index = users.findIndex(u => u.userId === target.id);

        if (index === -1) {
            return message.reply("No tienes datos todavía. ¡Envía mensajes para ganar XP!");
        }

        const userData = users[index];
        const rank = index + 1; 

        const embed = new EmbedBuilder()
            .setTitle(`📊 Ranking de ${target.user.tag}`)
            .setDescription(
                `**Posición:** #${rank}\n` +
                `**Nivel:** ${userData.level}\n` +
                `**XP:** ${userData.xp}`
            )
            .setColor("Purple");

        message.reply({ embeds: [embed] });
    }
};