const Command = require('../types/Command')
module.exports = new Command({name: 'say', execute: function(msg, args) {
    this.reply(msg, args.join(' '));
}});