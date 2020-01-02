const Command = require('../types/Command')
const { inspect } = require('util')

module.exports = class MasterEval extends Command {
  get name () {
    return 'master'
  }
  get group () {
    return 'owner'
  }
  wrapCodeblock (value) {
    return `\`\`\`js\n${inspect(value, { depth: 0 }).replace(/``/g, '``\u200b')}\n\`\`\``
  }
  execute (msg, args) {
    try {
      const value = eval(args.join(' ')) // eslint-disable-line no-eval
      if (value instanceof Promise) {
        if (inspect(value) === 'Promise { <pending> }') {
          this.master.createMessage(msg.channel.id, `**Resolving promise...**\n${wrapCodeblock(value)}`).then(masterMsg => {
            value.then(promiseValue => {
              masterMsg.edit(`**Promise resolved** 😎\n${wrapCodeblock(promiseValue)}`)
            })
          })
        } else {
          value.then(promiseValue => {
            this.master.createMessage(msg.channel.id, `**Promise resolved** 😎\n${wrapCodeblock(promiseValue)}`)
          })
        }
      } else {
        this.master.createMessage(msg.channel.id, wrapCodeblock(value))
      }
    } catch (error) {
      this.master.createMessage(msg.channel.id, error.message)
    }
  }
}
