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
      if (args[1]) {
        const difficulty = parseInt(args[1]);
        if (difficulty > 4 || difficulty < 1) {
          message.channel.send("That difficulty is not an option!");
        }
        battleShip.startGame(difficulty);
      } else {
        battleShip.startGame();
      }
      message.channel.send(formatForDiscord(battleship.drawBoard('C')));
    } else if (args[0] === 'fire' && args.length === 2) {
      message.channel.send(battleShip.fire(args[1]));
      message.channel.send(formatForDiscord(battleship.drawBoard('C')));
    }
  },
};
