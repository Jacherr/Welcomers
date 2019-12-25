class Command {
	constructor({name, execute, options}) {
		this.name = name || null;
		this.execute = execute || null;
		this.options = options || {};
		if(!name) {
			throw new Error('Name is a required argument that is missing.')
		} else if(!execute) {
			throw new Error('Execute is a required argument that is missing.')
		}
	}
	init(commander) {
		this.commander = commander;
	}
	get reply() {
		return this.commander.reply
	}
	get master() {
		return this.commander.master
	}
}
module.exports = Command;
