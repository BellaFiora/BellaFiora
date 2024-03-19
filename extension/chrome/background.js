// chrome.runtime.onInstalled.addListener(() => {
// chrome.action.setBadgeText({
//   text: "OFF",
// });
// });

// chrome.action.onClicked.addListener(async (tab) => {
// const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
// const nextState = prevState === 'ON' ? 'OFF' : 'ON'
// await chrome.action.setBadgeText({
// 	tabId: tab.id,
// 	text: nextState,
// });
// if (nextState === "ON") {
// 	await chrome.scripting.insertCSS({
// 		files: ["focus-mode.css"],
// 		target: { tabId: tab.id },
// 	});
// } else if (nextState === "OFF") {
// 	await chrome.scripting.removeCSS({
// 		files: ["focus-mode.css"],
// 		target: { tabId: tab.id },
// 	});
// }
// });

// chrome.tabs.onActivated.addListener((activeInfo) => {
// chrome.tabs.get(activeInfo.tabId, (tab) => {
//     if (tab.url.includes('https://osu.ppy.sh/users/')) {
//         chrome.tabs.sendMessage(tab.id, { action: "runContentScript" });
//     }
// });
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
// 	if (changeInfo.status === 'complete') {
// 		chrome.tabs.sendMessage(tabId, { action: 'pageLoaded' });
// 	}
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
// 	if (changeInfo.status === 'complete' && tab.status === 'complete' &&
// tab.url.startsWith('http')) { 		chrome.tabs.sendMessage(tabId, {
// action: 'DOMContentLoaded' });
// 	}
// });

// var url = null;

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
// 	return;
// 	if (changeInfo.url === null) { return; }
// 	if (changeInfo.url.startsWith('https://osu.ppy.sh/users/')) {
// 		if (changeInfo.url === url) { return; }
// 		// url has changed
// 		url = changeInfo.url;
// 		const { userId, mode } = parseUsersUrl();
// 		chrome.tabs.sendMessage(tabId, { script: 'users', userId:
// userId, mode: mode }, (response) => { 			if
// (chrome.runtime.lastError) {}
// 		});
// 	}
// });


// let socket;

// const urlWebSocket = 'ws://127.0.0.1:51247';
// function connectWebSocket() {
// 	console.log('connect')
// 	socket = new WebSocket(urlWebSocket);
// 	socket.onopen = function(event) {
// 	console.log('connect')
// 	};
// 	socket.onmessage = function(event) {
// 		// Traitez les messages reçus selon vos besoins
// 	};

// 	socket.onclose = function(event) {
// 		setTimeout(reconnect, 250);
// 	};
// 	socket.onerror = function(error) {
// 		console.error('Erreur : ', error);
// 		setTimeout(reconnect, 250);
// 	};
// }

// function reconnect() {
// 	console.log('Tentative de reconnexion...');
// 	connectWebSocket();
// }


// alert('Ceci est un message d\'alerte depuis background.js.');
//   setInterval(() => {
// 	chrome.runtime.sendMessage({ fromBackground: true }, function(response) {
// 		console.log(response.message); 
// 	  });
//   }, 1000);

chrome.webNavigation.onCompleted.addListener(function(details) {
	if (details.url.startsWith('https://osu.ppy.sh/users/')) {
		chrome.tabs.sendMessage(details.tabId, { request:'addElements' }, (response) => {
			if (chrome.runtime.lastError) {}
		});
	}
	if (details.url.startsWith('https://osu.ppy.sh/')) {
		chrome.tabs.sendMessage(
			details.tabId, { request:'createNotifications' }, (response) => {
				if (chrome.runtime.lastError) {}
		});
	}
	chrome.cookies.get({
		url: "https://osu.ppy.sh/*",
		name: "osu_session"
	}).then((cookie) => {
		chrome.tabs.sendMessage(details.tabId, { request: 'saveOsuSession', payload: cookie }, (response) => {
			if (chrome.runtime.lastError) {}
		});
	});
});

// chrome.webNavigation.onCommitted.addListener(function(details) {
// 	if (details.transitionType === 'reload' &&
// details.url.startsWith('https://osu.ppy.sh/users/')) {
// 		chrome.tabs.sendMessage(details.tabId, null, (response) => {
// 			if (chrome.runtime.lastError) {}
// 		});
// 	}
// });
