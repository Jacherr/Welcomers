module.exports = {
    name: 'say',
    execute(msg, args) {
        this.reply(msg, args.join(' '));
    }
};
