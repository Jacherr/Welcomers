const { EventEmitter } = require('eventemitter3')
const { ShardClient } = require('detritus-client')
const { Worker: NodeWorker } = require('worker_threads')
const Commander = require('./Commander')
const Worker = require('./Worker')

class Master extends EventEmitter {
  constructor (token) {
    super()
    this.workers = []
    this.tokens = []
    this.masterToken = token
    this.commander = new Commander(this)
    this.startMasterSocket()
    this.prepareCommander()
  }

  startMasterSocket () {
    this.client = new ShardClient(this.masterToken.replace('Bot ', ''))
    this.client.on('gatewayReady', () => {
      this.emit('ready')
    })
    this.client.run()
  }

  prepareCommander () {
    this.client.on('messageCreate', ({ message }) => {
      this.commander.onMessage(message)
    })
    this.commander.on('reply', ({ channelId, content }) => {
      for (const worker of this.workers) {
        worker.createMessage(channelId, content)
      }
    })
  }

  getWorkerByInstance (workerInstance) {
    return this.workers.find(({ instance }) => instance === workerInstance)
  }

  getWorkerByToken (token) {
    return this.workers.find(({ data }) => data.token === token)
  }

  loadTokens (tokens) {
    this.tokens = tokens
  }

  createWorker (token) {
    const workerData = {
      token,
      gatewayOptions: {
        presence: {
          status: 'online',
          game: {
            type: 0,
            name: 'i love not so super'
          }
        }
      }
    }
    const workerInstance = new NodeWorker('./worker-process.js', { workerData })
    const worker = new Worker(workerInstance, workerData)
    if (this.tokens.includes(token)) {
      this.workers.push(worker)
      this.emit('workerCreate', worker)
    }
    return worker
  }

  async launchWorkers (delayMs) {
    for (const token of this.tokens) {
      this.createWorker(token)
      await Promise.wait(delayMs)
    }
  }

  async killWorkers () {
    for (const worker of this.workers) {
      await worker.instance.terminate()
    }
  }

  createMessage (channelId, content) {
    return this.client.rest.createMessage(channelId, { content })
  }
}

module.exports = Master
