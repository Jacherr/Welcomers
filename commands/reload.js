const { readdir } = require('fs');
const { promisify } = require('util');
const preaddir = promisify(readdir);

module.exports = {
    name: 'reload',
    execute(msg) {
        try {
            out = require('child_process').execSync('git pull');
        } catch (e) {
            return this.master.client.rest.createMessage(msg.channel.id, e.message);
        }
        preaddir('./commands').then(files => {
            files.forEach(file => {
                delete require.cache[require.resolve(`./${file}`)];
            } );
            this.commands = [];
            this.commander.registerCommands();
        } );
        return this.master.client.rest.createMessage(msg.channel.id, 'Reloaded');
    },
	group: 'admin'
};
