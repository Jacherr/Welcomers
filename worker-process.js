const { Gateway } = require('detritus-client-socket');
const superagent = require('superagent');
const { workerData, parentPort } = require('worker_threads');

const { token, gatewayOptions } = workerData;

try {
	const socketClient = new Gateway.Socket(token, gatewayOptions);
	socketClient.on('ready', () => {
		parentPort.postMessage({
			id: null,
			type: 'GATEWAY_READY',
			data: null
		});
	});
	socketClient.on('close', event => {
		parentPort.postMessage({
			id: null,
			type: 'GATEWAY_CLOSE',
			data: event
		});
	});
	socketClient.connect('wss://gateway.discord.gg/');
	parentPort.on('message', message => {
		switch (message.type) {
			case 'HTTP_REQUEST':
				const { method, url, body, returnBody } = message.data;
				const request = superagent[method](url)
					.set('Authorization', token);
				if (body) request.send(body);
				request.end((error, response) => {
					if (error) {
						parentPort.postMessage({
							id: message.id,
							type: 'REQUEST_RESPONSE',
							error: true,
							data: {
								message: error.message,
								body: response && response.body
							}
						});
					} else {
						parentPort.postMessage({
							id: message.id,
							type: 'REQUEST_RESPONSE',
							error: false,
							data: returnBody ? response.body : null
						});
					}
				});
			break;
			case 'GATEWAY_PACKET':
				const { op, d } = message.data;
				socketClient.send(op, d);
			break;
		}
	});
} catch (error) {
	parentPort.postMessage({
		id: null,
		type: 'WORKER_CRASH',
		data: error.message
	});
	process.exit();
}
