const Guild = require('../models/Guild');

module.exports = {
    name: "setrank",
    async execute(message, args) {
        if (!message.member.permissions.has("Administrator"))
            return message.reply("No tenés permisos para usar este comando.");

        const level = parseInt(args[0]);
        const role = message.mentions.roles.first();

        if (isNaN(level) || !role)
            return message.reply("Uso: !setrank <nivel> @rol");

        let guild = await Guild.findOne({ guildId: message.guild.id });
        if (!guild) guild = new Guild({ guildId: message.guild.id });

        // Reemplaza si ya hay un rol para ese nivel
        guild.levelRoles = guild.levelRoles.filter(r => r.level !== level);
        guild.levelRoles.push({ level, roleId: role.id });

        await guild.save();

        message.reply(`Nivel ${level} vinculado al rol ${role.name}`);
    }
};