module.exports = {
    name: 'leave',
    execute(msg) {
        for (const worker of this.master.workers) {
            worker.leaveVoiceChannel(msg.guild.id);
        }
    }
};
