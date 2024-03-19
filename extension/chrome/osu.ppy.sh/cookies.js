let socket = new WebSocket('ws://localhost:1234');

let socketPromise = new Promise((resolve, reject) => {
    socket.addEventListener('open', function (event) {
		console.log('WebSocket connection established');
		resolve(socket);
    });

	socket.addEventListener('message', function (event) {
		console.log('Message from server:', event.data);
	});

	socket.addEventListener('close', function (event) {
		console.log('WebSocket connection closed');
	});

	socket.addEventListener('error', function (event) {
		console.error('WebSocket error:', event);
	});
});

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
	if (msg.request !== 'saveOsuSession') { return; }
	socketPromise.then((socket) => {
		socket.send(JSON.stringify(msg.payload));
	})
});