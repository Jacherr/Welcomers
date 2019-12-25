module.exports = {
    name: 'join',
    execute(msg, args) {
        for (const worker of this.master.workers) {
            worker.joinVoiceChannel(msg.guild.id, args[0]);
        }
    },
	group: 'admin'
};
