const Command = require('../types/Command')
module.exports = new Command({name: 'silenteval', execute: function(msg, args) {
    try {
        eval(args.join(' '));
      } catch (error) {
        this.master.client.rest.createMessage(msg.channel.id, error.message);
      }
}});