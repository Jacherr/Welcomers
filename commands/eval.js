const { inspect } = require('util')

module.exports = {
  name: 'eval',
  execute (msg, args) {
    try {
      for (const worker of this.workers) {
        const out = eval(args.join(' ')) // eslint-disable-line no-eval
        worker.createMessage(msg.channel.id, `\`\`\`js\n${inspect(out, { depth: 0 })}\`\`\``)
      }
    } catch (error) {
      this.master.client.rest.createMessage(msg.channel.id, error.message)
    }
  },
  group: 'owner'
}
