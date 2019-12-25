const Command = require('../types/Command')
const { inspect } = require('util')
module.exports = new Command({name: 'eval', execute: function(msg, args) {
    try {
        const out = eval(args.join(' '));
        this.reply(msg, `\`\`\`js\n${inspect(out, {depth: 0})}\`\`\``);
      } catch (error) {
        this.master.client.rest.createMessage(msg.channel.id, error.message);
      }
}});