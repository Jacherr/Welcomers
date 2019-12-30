module.exports = {
	name: 'eval',
	execute(msg, args) {
		try {
			for (const worker of this.workers) {
				worker;
				eval(args.join(' '));
			}
		} catch (error) {
			this.master.client.rest.createMessage(msg.channel.id, error.message);
		}
	},
	group: 'owner'
};
