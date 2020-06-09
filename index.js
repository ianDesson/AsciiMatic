// imports
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const { token } = require('./auth.json');

const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.startsWith(`${prefix}ping`))
    message.channel.send('Pong.');
  else if (message.content.startsWith(`${prefix}beep`))
    message.channel.send('Boop.');
});

client.login(token);
