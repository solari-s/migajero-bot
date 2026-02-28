const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
    guildId: { type: String, required: true },
    prefix: { type: String, default: "!" },
    levelChannel: { type: String, default: null },
    welcomeChannel: { type: String, default: null },
    levelRoles: {
        type: [
            {
                level: Number,
                roleId: String
            }
        ],
        default: []
    }
});

module.exports = model('Guild', guildSchema);