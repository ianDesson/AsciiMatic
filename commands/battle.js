const battleShip = require('../battleShip/battleship');
const battleship = require('../battleShip/battleship');

const formatForDiscord = (str) => {
  return `\`\`\`${str}\`\`\``;
};

module.exports = {
  name: 'battle',
  description: 'Plays 1-player BattleShip',
  execute(message, args) {
    if (!args.length) {
      message.channel.send("You didn't provide any arguments!");
    } else if (args[0] === 'start') {
      battleShip.startGame();
      message.channel.send(formatForDiscord(battleship.drawBoard()));
    } else if (args[0] === 'fire' && args.length === 2) {
      message.channel.send(battleShip.fire(args[1]));
      message.channel.send(formatForDiscord(battleship.drawBoard()));
    }
  },
};
