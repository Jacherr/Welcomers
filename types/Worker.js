const { EventEmitter } = require('eventemitter3')

class Worker extends EventEmitter {
  constructor (workerInstance, workerData) {
    super()
    this.instance = workerInstance
    this.data = workerData
    this.reqIdIncr = 0
    this.user = null
    this.getUser()
    this.prepareEvents()
  }

  getUser () {
    this.discordRequest('get', '/users/@me', null, true).then(user => {
      this.user = user
    })
  }

  prepareEvents () {
    this.instance.on('message', message => {
      switch (message.type) {
        case 'GATEWAY_READY':
          this.emit('ready')
          break
        case 'WORKER_CRASH':
          this.emit('crash')
          console.error(`Worker crashed ${this.data.token}`)
          break
        case 'GATEWAY_CLOSE':
          this.emit('disconnect')
          console.error(`Worker disconnected ${this.data.token}:`, message.data)
          break
      }
    })
  }

  discordRequest (method, path, body, returnBody) {
    const reqId = ++this.reqIdIncr
    return new Promise((resolve, reject) => {
      this.instance.postMessage({
        id: reqId,
        type: 'HTTP_REQUEST',
        data: {
          method,
          url: `https://discordapp.com/api${path}`,
          body: body || null,
          returnBody: !!returnBody
        }
      })
      this.waitForMessage({ id: reqId }, message => {
        if (message.type === 'REQUEST_RESPONSE') {
          if (message.error) {
            reject(new Error('Worker response error: ' + JSON.stringify(message.data)))
          } else {
            resolve(message.data)
          }
        }
      })
    })
  }

  discordPacket (op, data) {
    this.instance.postMessage({
      type: 'GATEWAY_PACKET',
      data: { op, d: data }
    })
  }

  waitForMessage (fields, fn) {
    const tempListener = (message) => {
      let isValid = true
      for (const [key, value] of Object.entries(fields)) {
        isValid &= message[key] === value
      }
      if (isValid) {
        this.instance.off('message', tempListener)
        fn(message)
      }
    }
    this.instance.on('message', tempListener)
  }

  getDMChannel (userId) {
    return this.discordRequest('post', '/users/@me/channels', {
      recipient_id: userId
    }, true)
  }

  createMessage (channelId, content, returnBody = false) {
    return this.discordRequest('post', `/channels/${channelId}/messages`, {
      content
    }, null, returnBody)
  }

  deleteMessage (channelId, messageId) {
    return this.discordRequest('delete', `/channels/${channelId}/messages/${messageId}`)
  }

  joinVoiceChannel (guildId, channelId) {
    this.discordPacket(4, {
      guild_id: guildId,
      channel_id: channelId
    })
  }

  leaveVoiceChannel (guildId) {
    this.discordPacket(4, {
      guild_id: guildId,
      channel_id: null
    })
  }
}

module.exports = Worker
