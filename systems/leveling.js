const User = require('../models/User');
const Guild = require('../models/Guild');

const cooldown = new Map(); // userId -> timestamp
const COOLDOWN_TIME = 60 * 1000; // 60 segundos

setInterval(() => {
    cooldown.clear();
}, 60 * 60 * 1000); // limpia cada hora

function xpToLevel(level) {
    return 40 * level ** 2 + (level * 50); 
}

// Esta es la función que va a manejar XP y niveles
async function levelingFunction(message, client) {
    if (message.author.bot) return;
    if (message.content.length < 5 ) return; 

    const now = Date.now();
    const userCooldown = cooldown.get(message.author.id);

    if (userCooldown && now - userCooldown < COOLDOWN_TIME) {
        return; // Está en cooldown
    }

    cooldown.set(message.author.id, now);

    let user = await User.findOne({
        guildId: message.guild.id,
        userId: message.author.id
    });

    if (!user) {
        user = new User({
            guildId: message.guild.id,
            userId: message.author.id,
            xp: 0,
            level: 1
        });
    }

    // Xp "random"
    const xpGain = Math.floor(Math.random() * 10) + 10; // 10-20
    user.xp += xpGain;

    const requiredXP = xpToLevel(user.level);

    if (user.xp >= requiredXP) {
        user.level++;

        await assignLevelRole(message.member, user);

        const guildConfig = await Guild.findOne({ guildId: message.guild.id });
        if (guildConfig?.levelChannel) {
            const channel = message.guild.channels.cache.get(guildConfig.levelChannel);
            if (channel) {
                channel.send(`🥳 Felicitaciones, ${message.author}! Subiste al nivel ${user.level} 💜!`);
            }
        }
    }

    await user.save();
}

// Función para asignar roles según nivel
async function assignLevelRole(member, userData) {
    const Guild = require('../models/Guild');
    const guildConfig = await Guild.findOne({ guildId: member.guild.id });
    if (!guildConfig || !guildConfig.levelRoles?.length) return;

    // Elegir el rol correspondiente al nivel
    const newRoleData = guildConfig.levelRoles
        .filter(r => r.level <= userData.level)
        .sort((a, b) => b.level - a.level)[0];

    if (!newRoleData) return;
    const newRole = member.guild.roles.cache.get(newRoleData.roleId);
    if (!newRole) return;

    // Quitar todos los roles de nivel que el usuario tenga
    const rolesToRemove = guildConfig.levelRoles
        .map(r => member.guild.roles.cache.get(r.roleId))
        .filter(r => r && member.roles.cache.has(r.id) && r.id !== newRole.id);

    if (rolesToRemove.length) {
        await member.roles.remove(rolesToRemove);
    }

    // Asignar el rol correspondiente
    if (!member.roles.cache.has(newRole.id)) {
        await member.roles.add(newRole);
    }
}

// Exportar correctamente
module.exports = {
    levelingFunction,
    assignLevelRole
};
