const Command = require('../types/Command')
module.exports = new Command({name: 'reload', execute: function(msg) {
    readdirAsync('./src/commands').then(files => {
        files.forEach(file => {
            delete require.cache[require.resolve(`../src/commands/${file}`)];
        } );
        this.commands = [];
        this.commander.registerCommands();
    } );
    return this.master.client.rest.createMessage(msg.channel, "Reloaded");
}});