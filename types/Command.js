class Command {
  constructor ({ name, execute, group, options }) {
    this.name = name || null
    this.execute = execute || null
    this.group = group || null
    this.options = Object.assign({}, options)
    if (!name) {
      throw new Error('Name is a required argument that is missing.')
    } else if (!execute) {
      throw new Error('Execute is a required argument that is missing.')
    }
  }

  init (commander) {
    this.commander = commander
  }

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
