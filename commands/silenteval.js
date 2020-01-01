module.exports = {
  name: 'silenteval',
  execute (msg, args) {
    try {
      for (const worker of this.workers) {
        void (worker) // eslint-disable-line no-void
        eval(args.join(' ')) // eslint-disable-line no-eval
      }
    } catch (error) {
      this.master.client.rest.createMessage(msg.channel.id, error.message)
    }
  },
  group: 'owner'
}
