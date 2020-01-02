const Command = require('../types/Command')

module.exports = class Say extends Command {
  get name () {
    return 'say'
  }
  get group () {
    return 'admin'
  }
  execute (msg, args) {
    this.reply(msg, args.join(' '))
  }
}
