const { EventEmitter } = require('eventemitter3');
const { userPerms, prefix } = require('../config');
const { readdir } = require('fs');
const { promisify } = require('util')
const preaddir = promisify(readdir)

class Commander extends EventEmitter {
  constructor(client) {
    super();
    this.master = client;
    this.commands = [];
    this.prefix = prefix || ';';
    this.registerCommands()
  }

  onMessage(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(this.prefix)) return;
    const [ commandName, ...args ] = message.content.replace(this.prefix, '').split(' ');
    const command = this.getCommandByName(commandName);
    if (!command) return;
    const authorPerms = userPerms[message.author.id];
    if (!authorPerms || (!command.public && !authorPerms.includes(command.name))) return;
    try {
      command.handle.call(this, message, args);
    } catch (error) {
      this.master.client.rest.createMessage(message.channel.id, `⚠️  **An error occurred**\n\`\`\`\n${error.message}\`\`\``);
    }
  }
  getCommandByName(commandName) {
    return this.commands.find(command => command.name === commandName);
  }
  registerCommands() {
    preaddir('./commands/').then(files => {
      files.forEach(file => {
        const command = require(`../commands/${file}`);
        this.commands.push({name: command.name, handle: command.execute, ...command.options})
      })
    })
  }
  reply(message, content) {
    this.emit('reply', {
      channelId: message.channel.id,
      content
    });
  }
}

module.exports = Commander;
