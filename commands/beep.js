module.exports = {
  name: 'beep',
  description: 'Replies with a Boop! message',
  execute(message, args) {
    message.channel.send('Boop!');
  },
};
