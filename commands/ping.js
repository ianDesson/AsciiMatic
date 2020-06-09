module.exports = {
  name: 'ping',
  description: 'Replies with a Ping! message',
  execute(message, args) {
    message.channel.send('Pong.');
  },
};
