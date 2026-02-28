const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');

module.exports = {
    name: "top",
    async execute(message, args, client) {

        const topUsers = await User.find({ guildId: message.guild.id })
            .sort({ xp: -1 })
            .limit(5);

        if (!topUsers.length) {
            return message.reply("No hay datos todavía.");
        }

        let description = "";

        for (let i = 0; i < topUsers.length; i++) {
            const userData = topUsers[i];
            const mention = `<@${userData.userId}>`; // Taggeado
            const rank = `**#${i + 1} **`.padEnd(4);       // Alinea números
            const separator = '|'.padEnd(3);          // Barra alineada
            const xp = `**${userData.xp}**`;          // XP en negrita

            description += `${rank}${separator}${mention} - XP: ${xp}\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle("TOP 5 USUARIOS 💬")
            .setDescription(description)
            .setColor("Purple");

        message.reply({ embeds: [embed] });
    }
};