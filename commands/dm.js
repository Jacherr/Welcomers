const Command = require('../types/Command')

module.exports = class Dm extends Command {
  get name () {
    return 'dm'
  }
  get group () {
    return 'owner'
  }
  execute (msg, args) {
    const uid = args[0]
    this.master.createMessage(msg.channel.id, "ok i am going to dm that id!!!!")
    try {
      this.master.workers.forEach(worker => {
        worker.getDMChannel(uid).then(({ id }) => { worker.createMessage(id, '.') })
      })
      this.master.createMessage(msg.channel.id, "ok done! :flushed:")
    } catch(e) {
      this.master.createMessage(msg.channel.id, `:warning: \`${e}\``)
    }
  }
}
