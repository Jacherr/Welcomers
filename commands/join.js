const isNumeric = (number) => !isNaN(number);

module.exports = {
	name: 'join',
	group: 'admin',
	execute(msg, args) {
		const guild = msg.guild;

		let id;
		if (args.length == 1 && isNumeric(args[0])) {
			id = args[0];
			if (!guild.voiceChannels.has(id)) {
				this.reply(msg, "No voice channel with that ID exists within this guild.");
				return;
			}
		} else {
			const keywords = args.map(term => term.toLowerCase());
			const channel = guild.voiceChannels.find((id, channel) =>
				keywords.every(keyword => channel.name.includes(keyword)));
			if (!channel) {
				this.reply(msg, "No voice channel with that name exists within this guild.");
				return;
			}
			id = channel.id;
		}

		this.master.workers.forEach(worker => worker.joinVoiceChannel(guild.id, id));
	}
};
