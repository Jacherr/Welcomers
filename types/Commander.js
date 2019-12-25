const { EventEmitter } = require('eventemitter3');
const { userPerms, prefix } = require('../config');

class Commander extends EventEmitter {
  constructor() {
    super();
    this.commands = [];
    this.prefix = prefix || ';';
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
      this.reply(message, `⚠️  **An error occurred**\n\`\`\`\n${error.message}\`\`\``);
    }
  }

  getCommandByName(commandName) {
    return this.commands.find(command => command.name === commandName);
  }

  registerCommand(name, handleFn, extra) {
    this.commands.push({ name, handle: handleFn, ...extra });
  }
  reply(message, content) {
    this.emit('reply', {
      channelId: message.channel.id,
      content
    });
  }
}

module.exports = Commander;
