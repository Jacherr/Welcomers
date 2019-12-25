const Command = require('../types/Command')
module.exports = new Command({name: 'reload', execute: function(msg) {
    try {
        out = require('child_process').execSync('git pull');
    } catch (e) {
        return this.master.client.rest.createMessage(msg.channel, e.message);
    }
    readdirAsync('./src/commands').then(files => {
        files.forEach(file => {
            delete require.cache[require.resolve(`../src/commands/${file}`)];
        } );
        this.commands = [];
        this.commander.registerCommands();
    } );
    return this.master.client.rest.createMessage(msg.channel, "Rebuilt");
}});