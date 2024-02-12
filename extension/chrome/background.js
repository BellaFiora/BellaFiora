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
// 	if (changeInfo.status === 'complete' && tab.status === 'complete' && tab.url.startsWith('http')) {
// 		chrome.tabs.sendMessage(tabId, { action: 'DOMContentLoaded' });
// 	}
// });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	chrome.tabs.sendMessage(tabId, { action: 'tabUpdated' });
});