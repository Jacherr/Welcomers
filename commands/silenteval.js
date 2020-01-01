module.exports = {
	name: 'silenteval',
	execute(msg, args) {
		try {
			for (const worker of this.workers) {
				void(worker);
				eval(args.join(' '));
			}
		} catch (error) {
			this.master.client.rest.createMessage(msg.channel.id, error.message);
		}
	},
	group: 'owner'
};
