module.exports = {
	name: 'silenteval',
	execute(msg, args) {
		try {
			eval(args.join(' '));
		} catch (error) {
			this.master.client.rest.createMessage(msg.channel.id, error.message);
		}
	}
};
