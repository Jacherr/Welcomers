const Command = require('../types/Command')
module.exports = new Command({name: 'mother', execute: function(msg) {
    try {
        const out = eval(args.join(' '));
        this.master.client.rest.createMessage(msg.channel.id, `\`\`\`js\n${inspect(out, {depth: 0})}\n\`\`\``)
      } catch (error) {
        this.master.client.rest.createMessage(msg.channel.id, error.message)
      }
}});