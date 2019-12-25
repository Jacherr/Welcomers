module.exports = {
	name: 'mother',
	execute(msg) {
		try {
			const out = eval(args.join(' '));
			this.master.client.rest.createMessage(msg.channel.id, `\`\`\`js\n${inspect(out, {depth: 0})}\n\`\`\``)
		} catch (error) {
			this.master.client.rest.createMessage(msg.channel.id, error.message)
		}
	}
};
