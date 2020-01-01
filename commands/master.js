const { inspect } = require('util')

module.exports = {
  name: 'master',
  execute (msg, args) {
    try {
      const out = eval(args.join(' ')) // eslint-disable-line no-eval
      this.master.client.rest.createMessage(msg.channel.id, `\`\`\`js\n${inspect(out, { depth: 0 })}\n\`\`\``)
    } catch (error) {
      this.master.client.rest.createMessage(msg.channel.id, error.message)
    }
  },
  group: 'owner'
}
