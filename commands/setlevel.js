const User = require('../models/User');
const { assignLevelRole } = require('../systems/leveling');

module.exports = {
    name: "setlevel",
    async execute(message, args) {
        if (!message.member.permissions.has("Administrator"))
            return message.reply("No tenés permisos para usar este comando.");

        const member = message.mentions.members.first();
        const newLevel = parseInt(args[1]);

        if (!member || isNaN(newLevel)) {
            return message.reply("Uso: !setlevel @usuario <nivel>");
        }

        let user = await User.findOne({ guildId: message.guild.id, userId: member.id });

        if (!user) {
            user = new User({ guildId: message.guild.id, userId: member.id });
        }

        user.level = newLevel;
        user.xp = (30 * newLevel ** 2) + (newLevel * 50); 
        await user.save();

        // Asignar rol de nivel automáticamente
        await assignLevelRole(member, user);

        message.reply(`El nivel de ${member.user.tag} fue seteado a ${newLevel}`);
    }
};