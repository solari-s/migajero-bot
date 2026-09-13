const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    money: { type: Number, default: 0 },
    rank: { type: String, default: "Miembro" },
    minecraftNick: { type: String, default: null }
}, { timestamps: true });

module.exports = model('User', userSchema);