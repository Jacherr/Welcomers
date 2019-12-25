const { inspect } = require('util');

module.exports = {
	name: 'eval',
	execute(msg, args) {
		try {
			const out = eval(args.join(' '));
			this.reply(msg, `\`\`\`js\n${inspect(out, {depth: 0})}\`\`\``);
		} catch (error) {
			this.master.client.rest.createMessage(msg.channel.id, error.message);
		}
	},
	group: 'owner'
};
