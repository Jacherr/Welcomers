Promise.wait = ms => new Promise(x => setTimeout(x, ms));

const { inspect } = require('util')
const { tokens: tokensString, welcomeChannel, logChannel, welcomeGuild, masterToken } = require('./config');
const Master = require('./types/Master');

const tokens = tokensString.split(',').map(token => token.startsWith('Bot ') ? token : 'Bot ' + token);
const activeWelcoming = {};

let welcomeStatus = {
    startedAt: 0,
    endsAt: 0,
	welcomes: 0,
	alerted: false,
};

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
			console.log(worker.user.username + " started")
			//worker.createMessage(logChannel, 'Started 😀😉');
		} catch(e) {
			console.error("=====\n\nError sending ready message: " + e.message + "\n\n=====")
		}
	});
});

master.client.on('guildMemberAdd', async ({ member }) => {
	if(Date.now() > welcomeStatus.endsAt) {
		welcomeStatus = {
			startedAt: Date.now(),
			endsAt: Date.now() + 10000,
			welcomes: 0,
			alerted: false,
		}
	} else if(welcomeStatus.welcomes > 3) {
		if(welcomeStatus.alerted === false) {
			welcomeStatus.alerted = true
			return master.client.rest.createMessage('658333795673702423', "Too many people are joining and the welcoming got ratelimited ass")
		} else return
	}
	if (member.guild.id !== welcomeGuild) return;
	if (member.user.bot) return;
	activeWelcoming[member.id] = true;
	for (const worker of master.workers) {
		if (!activeWelcoming[member.id]) return;  
		const dmChannel = await worker.getDMChannel(member.id);
		//await worker.createMessage(welcomeChannel, `<@${member.id}> welcome 😉`)
		//await worker.createMessage(welcomeChannel, `<@${member.id}> enjoy your stay 😀`);
		if(dmChannel) {
			try {
				await worker.createMessage(dmChannel.id, `<@${member.id}> welcome to **${member.guild.name}** 😄`)
				await worker.createMessage(dmChannel.id, `<@${member.id}> enjoy your stay 😀`);
			} catch {
				console.log("Failed to send messages to " + member.user.username)
				break
			}
		}
		// await Promise.wait(100);
	}
	delete activeWelcoming[member.id];
});
master.client.on('guildMemberRemove', ({ userId, guildId }) => {
	if (guildId !== welcomeGuild) return;
	if (activeWelcoming[userId]) delete activeWelcoming[userId];
});
