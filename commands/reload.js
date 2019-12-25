const Command = require('../types/Command')
const { readdir } = require('fs');
const { promisify } = require('util')
const preaddir = promisify(readdir)
module.exports = new Command({name: 'reload', execute: function(msg) {
    try {
        out = require('child_process').execSync('git pull');
    } catch (e) {
        return this.master.client.rest.createMessage(msg.channel, e.message);
    }
    preaddir('./src/commands').then(files => {
        files.forEach(file => {
            delete require.cache[require.resolve(`../src/commands/${file}`)];
        } );
        this.commands = [];
        this.commander.registerCommands();
    } );
    return this.master.client.rest.createMessage(msg.channel, "Reloaded");
}});