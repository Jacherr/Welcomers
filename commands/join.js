const Command = require('../types/Command')
module.exports = new Command({name: 'join', execute: function(msg, args) {
    for (const worker of this.master.workers) {
        worker.joinVoiceChannel(msg.guild.id, args[0]);
    }
}});