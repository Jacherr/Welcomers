class Command {
  constructor (commander) {
    this.commander = commander
    if (!this.name) {
      throw new Error('The required "name" property is missing in this Command.')
    } else if (!this.execute) {
      throw new Error('The required "execute" method is missing in this Command.')
    }
  }
  get name () {}
  get group () {}

  get master () {
    return this.commander.master
  }
  get workers () {
    return this.master.workers
  }
  reply (msg, content) {
    this.commander.createMessage(msg.channel.id, content)
  }
}
module.exports = Command
