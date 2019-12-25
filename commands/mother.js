const { inspect } = require('util');

module.exports = {
	name: 'mother',
	execute(msg, args) {
		try {
			const out = eval(args.join(' '));
			this.master.client.rest.createMessage(msg.channel.id, `\`\`\`js\n${inspect(out, {depth: 0})}\n\`\`\``)
		} catch (error) {
			this.master.client.rest.createMessage(msg.channel.id, error.message)
		}
	},
	group: 'owner'
};
