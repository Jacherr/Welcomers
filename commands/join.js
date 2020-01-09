const Command = require('../types/Command')

module.exports = class Join extends Command {
  get name () {
    return 'join'
  }
  get group () {
    return 'admin'
  }
  execute (msg, args) {
    const guild = msg.guild

    if (args[0] === 'SCATTER') {
      const voiceChannels = guild.voiceChannels.toArray()
      if (voiceChannels.length === 0) return
      this.master.workers.forEach(worker => {
        const channel = voiceChannels[Math.floor(Math.random() * voiceChannels.length)]
        worker.joinVoiceChannel(guild.id, channel.id)
      })
      return
    }

    let id
    if (args.length === 1 && !isNaN(args[0])) {
      id = args[0]
      if (!guild.voiceChannels.has(id)) {
        this.reply(msg, 'No voice channel with that ID exists within this guild.')
        return
      }
    } else {
      const keywords = args.map(term => term.toLowerCase())
      const channel = guild.voiceChannels.find(channel =>
        keywords.every(keyword => channel.name.toLowerCase().includes(keyword)))
      if (!channel) {
        this.reply(msg, 'No voice channel with that name exists within this guild.')
        return
      }
      id = channel.id
    }

    this.master.workers.forEach(worker => worker.joinVoiceChannel(guild.id, id))
  }
}
