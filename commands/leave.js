const Command = require('../types/Command')
module.exports = new Command({name: 'leave', execute: function(msg) {
    for (const worker of this.master.workers) {
        worker.leaveVoiceChannel(msg.guild.id);
    }
}});