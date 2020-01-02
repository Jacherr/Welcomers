const Command = require('../types/Command')

module.exports = class Leave extends Command {
  get name () {
    return 'leave'
  }
  get group () {
    return 'admin'
  }
  execute (msg) {
    for (const worker of this.master.workers) {
      worker.leaveVoiceChannel(msg.guild.id)
    }
  }
}
