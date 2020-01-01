const { readdir } = require('fs')
const { promisify } = require('util')
const preaddir = promisify(readdir)

module.exports = {
  name: 'reload',
  execute (msg) {
    let out
    try {
      out = require('child_process').execSync('git pull')
    } catch (e) {
      return this.master.createMessage(msg.channel.id, e.message)
    }
    preaddir('./commands').then(files => {
      files.forEach(file => {
        delete require.cache[require.resolve(`./${file}`)]
      })
      this.commander.commands = []
      this.commander.registerCommands()
    })
    return this.master.createMessage(msg.channel.id, `Reloaded\n\`\`\`bash\n${out}\n\`\`\``)
  },
  group: 'admin'
}
