const { levelingFunction } = require('../systems/leveling');
const handleCommands = require('./commandHandler');

module.exports = async (message, client) => {
    // Manejar XP / niveles
    await levelingFunction(message, client);

    // Manejar comandos
    await handleCommands(message, client);
};