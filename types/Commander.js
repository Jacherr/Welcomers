const { EventEmitter } = require('eventemitter3')
const { readdir } = require('fs')
const { promisify } = require('util')
const Command = require('./Command')
const { userGroups, prefix } = require('../config')
const preaddir = promisify(readdir)
const groupNames = Object.keys(userGroups)

class Commander extends EventEmitter {
  constructor (client) {
    super()
    this.master = client
    this.commands = []
    this.prefix = prefix || ';'
    this.registerCommands()
  }

  onMessage (message) {
    if (message.author.bot) return
    if(message.content === "@someone") {
      const id = msg.channel.guild.members.map(i => i)[Math.floor(Math.random() * msg.channel.guild.members.size)].user.id
      return this.master.client.createMessage(message.channel, `<@${id}>`)
    }
    if (!message.content.startsWith(this.prefix)) return
    const [commandName, ...args] = message.content.replace(this.prefix, '').split(' ')
    const command = this.getCommandByName(commandName)
    if (!command) return
    if (command.group) {
      const level = groupNames.indexOf(command.group)
      for (let i = 0; i <= level; i++) {
        const group = userGroups[groupNames[i]]
        if (group.includes(message.author.id)) break
        if (i === level) return
      }
    }
    try {
      command.execute(message, args)
    } catch (error) {
      this.master.createMessage(message.channel.id, `⚠️  **An error occurred**\n\`\`\`\n${error.message}\`\`\``)
    }
  }

  getCommandByName (commandName) {
    return this.commands.find(command => command.name === commandName)
  }

  registerCommands () {
    preaddir('./commands/').then(files => {
      files.forEach(file => {
        const commandData = require(`../commands/${file}`)
        const command = new Command(commandData)
        command.init(this)
        this.commands.push(command)
      })
    })
  }

  createMessage (channelId, content) {
    this.emit('reply', { channelId, content })
  }
}

module.exports = Commander
