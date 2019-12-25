const Command = require('../types/Command')
const { inspect } = require('util')
module.exports = new Command({name: 'mother', execute: function(msg, args) {
    try {
        const out = eval(args.join(' '));
        this.master.client.rest.createMessage(msg.channel.id, `\`\`\`js\n${inspect(out, {depth: 0})}\n\`\`\``)
      } catch (error) {
        this.master.client.rest.createMessage(msg.channel.id, error.message)
      }
}});