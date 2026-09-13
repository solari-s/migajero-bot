const User = require('../models/User');

module.exports = {
  name: "nickMine",
  async execute(message, args) {

    const allowedChannelId = "1429879045566496931";

    if (message.channel.id !== allowedChannelId) {
    return message.reply("Usá este comando en el canal correcto.");
    }

    const nick = args[0];
    if (!nick) {
      return message.reply("Uso: !nick <tuNick>");
    }

    if (!/^[a-zA-Z0-9_]{3,16}$/.test(nick)) {
      return message.reply("Nick inválido.");
    }

    let user = await User.findOne({
      guildId: message.guild.id,
      userId: message.author.id
    });

    if (!user) {
      user = new User({
        guildId: message.guild.id,
        userId: message.author.id
      });
    }

    user.minecraftNick = nick;
    await user.save();

    await syncWhitelist(message.member, user);

    message.reply(`Nick guardado: ${nick}`);
  }
};