const Guild = require('../models/Guild');

module.exports = {
    name: "setwelcomechannel",
    async execute(message) {
        if (!message.member.permissions.has("Administrator"))
            return message.reply("No tenés permisos para usar este comando.");

        const channel = message.mentions.channels.first();
        if (!channel) return message.reply("Tenés que mencionar un canal.");

        let guild = await Guild.findOne({ guildId: message.guild.id });
        if (!guild) guild = new Guild({ guildId: message.guild.id });

        guild.welcomeChannel = channel.id;
        await guild.save();

        message.reply(`Canal de bienvenida configurado en ${channel}`);
    }
};