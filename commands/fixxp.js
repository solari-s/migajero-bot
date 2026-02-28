const User = require('../models/User');

module.exports = {
    name: "fixxp",
    async execute(message) {

        if (!message.member.permissions.has("Administrator"))
            return message.reply("No tenés permisos para usar este comando.");

        const guildId = message.guild.id;

        const users = await User.find({ guildId });

        if (!users.length)
            return message.reply("No hay usuarios guardados en la base de datos.");

        function xpToLevel(level) {
            return 35 * level ** 2 + (level * 50);
        }

        let updated = 0;

        for (const user of users) {
            user.xp = xpToLevel(user.level);
            await user.save();
            updated++;
        }

        message.reply(`✅ Se actualizaron ${updated} usuarios correctamente.`);
    }
};