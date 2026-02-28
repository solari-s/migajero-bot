const Guild = require('../models/Guild');

module.exports = {
    name: "setprefix",
    async execute(message, args) {
        if (!message.member.permissions.has("Administrator"))
            return message.reply("No tenés permisos para usar este comando.");

        const newPrefix = args[0];
        if (!newPrefix) return message.reply("Tenés que poner un nuevo prefijo.");

        let guild = await Guild.findOne({ guildId: message.guild.id });
        if (!guild) guild = new Guild({ guildId: message.guild.id });

        guild.prefix = newPrefix;
        await guild.save();

        message.reply(`Prefijo cambiado a \`${newPrefix}\``);
    }
};