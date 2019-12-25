Promise.wait = ms => new Promise(x => setTimeout(x, ms));

const { inspect } = require('util')
const { tokens: tokensString, welcomeChannel, logChannel, welcomeGuild, masterToken } = require('./config');
const Master = require('./types/Master');

const tokens = tokensString.split(',').map(token => token.startsWith('Bot ') ? token : 'Bot ' + token);
const activeWelcoming = {};

console.log('Starting master instance');
const master = new Master(masterToken);
master.loadTokens(tokens);

master.on('ready', () => {
  const workerDelay = 100;
  console.log(`Master instance ready, launching workers (delay: ${workerDelay}ms)`);
  master.launchWorkers(workerDelay)
    .then(() => {
      console.log('Launched all workers');
    })
    .catch(error => {
      console.error(error);
    });
});

master.on('workerCreate', worker => {
  console.log(`Launched ${master.workers.length}/${master.tokens.length} workers`);
  worker.on('ready', () => {
    try {
      worker.createMessage(logChannel, 'Started 😀😉');
    } catch(e) {
      console.error("=====\n\nError sending ready message: " + e.message + "\n\n=====")
    }
  });
});

master.client.on('guildMemberAdd', async ({ member }) => {
  if (member.guild.id !== welcomeGuild) return;
  if (member.user.bot) return;
  activeWelcoming[member.id] = true;
  for (const worker of master.workers) {
    if (!activeWelcoming[member.id]) return;  
    const dmChannel = await worker.getDMChannel(member.id);
    await worker.createMessage(welcomeChannel, `<@${member.id}> welcome 😉`)
    await worker.createMessage(welcomeChannel, `<@${member.id}> enjoy your stay 😀`);
    if(dmChannel) {
      await worker.createMessage(dmChannel.id, `<@${member.id}> welcome to **${member.guild.name}** 😄`)
      await worker.createMessage(dmChannel.id, `<@${member.id}> enjoy your stay 😀`);
    }
    // await Promise.wait(100);
  }
  delete activeWelcoming[member.id];
});
master.client.on('guildMemberRemove', ({ userId, guildId }) => {
  if (guildId !== welcomeGuild) return;
  if (activeWelcoming[userId]) delete activeWelcoming[userId];
});

master.commander.registerCommand('say', function (msg, args) {
  this.reply(msg, args.join(' '));
});
master.commander.registerCommand('eval', function (msg, args) {
  try {
    const out = eval(args.join(' '));
    this.reply(msg, `\`\`\`js\n${inspect(out, {depth: 0})}\`\`\``);
  } catch (error) {
    this.reply(msg, error.message);
  }
});
master.commander.registerCommand('silenteval', function (msg, args) {
  try {
    eval(args.join(' '));
  } catch (error) {
    this.reply(msg, error.message);
  }
});
master.commander.registerCommand('join', function (msg, args) {
  for (const worker of master.workers) {
    worker.joinVoiceChannel(msg.guild.id, args[0]);
  }
});
master.commander.registerCommand('leave', function (msg) {
  for (const worker of master.workers) {
    worker.leaveVoiceChannel(msg.guild.id);
  }
});
master.commander.registerCommand('mother', function(msg, args) {
  try {
    const out = eval(args.join(' '));
    master.client.createMessage(msg.channel.id, `\`\`\`js\n${inspect(out, {depth: 0})}\n\`\`\``)
  } catch (error) {
    master.client.createMessage(msg.channel.id, error.message)
  }
})
