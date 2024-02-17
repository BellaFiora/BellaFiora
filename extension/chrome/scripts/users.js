var url = null;
if (window.location.href === url) { exit(0); }
url = window.location.href;

var fetchPromise = null;
var playerId = null;
var mode = null;
var locale = null;
var historical = null;
var playerInfos = {
	'osu': null,
	'taiko': null,
	'fruits': null,
	'mania': null
};

function parseUrl() {
	const startIndex = 'https://osu.ppy.sh/users/'.length;
	const endIndex = url.indexOf('/', startIndex);
	if (endIndex === -1) {
		playerId = url.substring(startIndex, url.length);
		mode = '';
		mode.length = 0;
	} else {
		playerId = url.substring(startIndex, endIndex);
		mode = url.substring(endIndex + 1, url.length);
	}
	console.log('parseUrl: playerId = ' + playerId);
	console.log('parseUrl: mode = ' + mode);
}

parseUrl();

function convertTime(seconds) {
	const days = Math.floor(seconds / (24 * 60 * 60));
	const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	let result = "";
	if (days > 0) {
		result += days + "d ";
	}
	if (hours > 0) {
		result += hours + "h ";
	}
	if (minutes > 0) {
		result += minutes + "m ";
	}
	return {
		string: result.trim(),
		hours: Math.floor(seconds/3600)
	}
}

function getGameModes() {
	return document.querySelector("body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.header-v4.header-v4--users > div:nth-child(2) > div > div > ul.game-mode");
}

function getPlaycount() {
	return document.querySelector('body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div.profile-stats > dl.profile-stats__entry.profile-stats__entry--key-play_count');
}

function getProfileDetailChartNumbers() {
	return document.querySelector('body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) > div:nth-child(3) > div.profile-detail__values.profile-detail__values--grid');
}

function addGlobalPlayTime() {
	const labelElements = document.querySelectorAll('.value-display__label');
	let mode_text = mode === 'fruits' ? 'ctb' : mode;
	labelElements[4].innerText = `${mode_text} Playtime`;
	labelElements[4].style = 'text-transform: capitalize;';

	const outerDiv = document.createElement("div");
	outerDiv.classList.add("value-display", "value-display--plain", "value-display--plain-wide");
	outerDiv.setAttribute('id', 'TotalPlayTime');

	const labelDiv = document.createElement("div");
	labelDiv.classList.add("value-display__label");
	labelDiv.textContent = "Total Playime";

	const valueDiv = document.createElement("div");
	valueDiv.classList.add("value-display__value");

	const spanElement = document.createElement("span");
	spanElement.setAttribute("data-tooltip-position", "bottom center");
	spanElement.setAttribute("title", '-');
	spanElement.textContent = '-';

	valueDiv.appendChild(spanElement);
	outerDiv.appendChild(labelDiv);
	outerDiv.appendChild(valueDiv);
	getProfileDetailChartNumbers().appendChild(outerDiv);
}

function updateGlobalPlayTime() {
	const globalPlayTime = convertTime(playerInfos.osu.user.statistics.play_time + playerInfos.taiko.user.statistics.play_time + playerInfos.fruits.user.statistics.play_time + playerInfos.mania.user.statistics.play_time);
	const gpt = document.getElementById('TotalPlayTime').querySelector('div:nth-child(2) > span');
	if (true) {
		gpt.setAttribute("title", globalPlayTime.string);
		gpt.textContent = `${globalPlayTime.hours.toLocaleString(locale)} hours`;
	} else {

	}
}

function addProfileStat(parent, keyTextContent, valueTextContent, id) {
	var entry = document.createElement('dl');
	entry.setAttribute('id', id);
	var key =  document.createElement('dt');
	var value =  document.createElement('dd');
	entry.classList.add('profile-stats__entry');
	entry.classList.add('profile-stats__entry--key-play_count');
	key.classList.add('profile-stats__key');
	value.classList.add('profile-stats__value');
	key.textContent = keyTextContent;
	value.textContent = valueTextContent;
	entry.appendChild(key);
	entry.appendChild(value);

	parent.insertAdjacentElement('afterend', entry);
	return entry;
}

const totalPlaycountId = 'total_playcount';
const totalPlaycountV2Id = 'total_playcount_v2';

function addTotalPlaycounts() {
	const totalPlaycountEntry = addProfileStat(getPlaycount(), 'Total Play Count', '-', totalPlaycountId);
	addProfileStat(totalPlaycountEntry, 'Total Play Count V2', '-', totalPlaycountV2Id);
}

function getTotalPlaycount() {
	let totalPlaycount = 0;
	for (let e of historical["monthly_playcounts"]) {
		totalPlaycount += parseInt(e["count"]);
	}
	return totalPlaycount;
}

function getTotalPlaycountV2(totalPlaycount) {
	return totalPlaycount - playerInfos['osu'].user.statistics.play_count - playerInfos['taiko'].user.statistics.play_count - playerInfos['fruits'].user.statistics.play_count - playerInfos['mania'].user.statistics.play_count;
}

function updateTotalPlaycounts() {
	const totalPlaycount = getTotalPlaycount();
	document.getElementById(totalPlaycountId).querySelector('.profile-stats__value').textContent = totalPlaycount.toLocaleString(locale);
	document.getElementById(totalPlaycountV2Id).querySelector('.profile-stats__value').textContent = getTotalPlaycountV2(totalPlaycount).toLocaleString(locale);
}

async function fetchHistorical() {
	const tmp = await fetch(`https://osu.ppy.sh/users/${playerId}/extra-pages/historical`);
	historical = await tmp.json();
}

// getPlayerInfos

async function htmlDecode(input) {
	const doc = new DOMParser().parseFromString(input, "text/html");
	return doc.documentElement.textContent;
}

async function RawHtmlToJson(content) {
	const startIndex = content.indexOf('data-initial-data="') + 'data-initial-data="'.length;
	content = content.substring(startIndex);
	const endIndex = content.indexOf('</div>') - 7;
	const jsonText = content.substring(0, endIndex);
	return JSON.parse(await htmlDecode(jsonText));
}

async function fetchMode(mode) {
	try {
		const res = await fetch(`https://osu.ppy.sh/users/${playerId}/${mode}`);
		const tmp = await RawHtmlToJson(await res.text());
		playerInfos[mode] = tmp;
		localStorage['playerInfos_' + mode] = JSON.stringify(tmp);
	} catch(e) {
		throw Error(e);
	}
}

async function fetchAllModes() {
	try {
		await Promise.all([fetchMode('osu'), fetchMode('taiko'), fetchMode('fruits'), fetchMode('mania')]);
	} catch (e) {
		throw Error(e);
	}
}

function addCustomCSS() {
	customCss = document.createElement('style');
	customCss.textContent = `
	body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) > div:nth-child(3) > div.profile-detail__values.profile-detail__values--grid {
		grid-template-columns: repeat(6,1fr);
		gap: 2px;
	}
	body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) {
		gap: 0px;
	}
	body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) {
		margin-left: -17px;
	}
	#TotalPlayTime {
		margin-left: -20px;
	}
	`;

	document.head.appendChild(customCss);
}

function getCurrentGamemode() {
	const meta = document.querySelectorAll('head > meta[name="description"]');
	let content = Array.from(meta)[0].getAttribute('content');
	mode = content.substring(content.indexOf('(') + 1, content.indexOf(')'));
}

function switchDaysAndHours() {
	const pt = document.querySelector('body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) > div:nth-child(3) > div.profile-detail__values.profile-detail__values--grid > div:nth-child(3) > div.value-display__value > span');
	const tmp = pt.getAttribute('title');
	pt.setAttribute('title', pt.textContent);
	pt.textContent = tmp;
}

function addPlaceHolderHTML() {
	if (mode.length === 0) {
		getCurrentGamemode();
		console.log('addPlaceHolderHTML: mode = ' + mode);
	}
	addTotalPlaycounts();
	addGlobalPlayTime();
}

function updateHTML() {
	updateTotalPlaycounts();
	updateGlobalPlayTime();
}

async function fetchAll() {
	return new Promise(async (resolve, reject) => {
		console.log('entering fetchAll');
		await fetchAllModes();
		await fetchHistorical();
		resolve(true);
	});	
}

// undefined or false
if (!localStorage['comeFromModeButton'] || localStorage['comeFromModeButton'] === 'false' || localStorage['comeFromMyProfile']) {
	fetchPromise = fetchAll();
} else {
	playerInfos.osu = JSON.parse(localStorage['playerInfos_osu']);
	playerInfos.taiko = JSON.parse(localStorage['playerInfos_taiko']);
	playerInfos.fruits = JSON.parse(localStorage['playerInfos_fruits']);
	playerInfos.mania = JSON.parse(localStorage['playerInfos_mania']);
	fetchPromise = new Promise(async (resolve, reject) => {
		await fetchHistorical();
		await fetchMode(localStorage['targetMode']);
		resolve(true);
	});
}
localStorage['comeFromModeButton'] = 'false';
localStorage['comeFromMyProfile'] = 'false';

function getLocale() {
	let text = document.querySelector('html').getAttribute('lang');
	let startIndex = text.indexOf('currentLocale') + 'currentLocale'.length + 4;
	locale = text.substring(startIndex, text.indexOf('"', startIndex));
	console.log('getLocale: locale = ' + locale);
}

async function addElements() {
	console.log('entering addElements');
	addCustomCSS();
	addPlaceHolderHTML();
	if (true) {
		switchDaysAndHours();
	}
	gameModes = getGameModes();

	// TO FIX: me! links to self, anywhere -> back, search bar, profile banner from home

	for (let buttonMode of Object.keys(playerInfos)) {
		gameModes.querySelector(`a[data-mode="${buttonMode}"]`).addEventListener('click', async (event) => {
			localStorage['comeFromModeButton'] = 'true';
			localStorage['targetMode'] = buttonMode;
			event.preventDefault();
			window.location.href = `https://osu.ppy.sh/users/${playerId}/${buttonMode}`;
		});
	}
	document.querySelector("body > div.js-pinned-header.hidden-xs.no-print.nav2-header > div.nav2-header__body > div.osu-page > div > div.nav2__colgroup.nav2__colgroup--icons.js-nav-button--container > div.nav2__col.nav2__col--avatar > div > div > a:nth-child(3)").addEventListener('click', async (event) => {
		localStorage['comeFromMyProfile'] = 'true';
		event.preventDefault();
		window.location.href = document.querySelector("body > div.js-pinned-header.hidden-xs.no-print.nav2-header > div.nav2-header__body > div.osu-page > div > div.nav2__colgroup.nav2__colgroup--icons.js-nav-button--container > div.nav2__col.nav2__col--avatar > a").getAttribute('href');
	});
	getLocale();
	fetchPromise.then(() => {
		updateHTML();
	})
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
	addElements();
});

// function getHistoric() {
// 	try {
// 		return document.querySelector('div.js-sortable--page[data-page-id="historical"]');
// 	} catch (e) {
// 		return null;
// 	}
// }

// function getGraph(historic) {
// 	try {
// 		return historic.querySelector('div > :nth-child(2) > div > div > svg > g > path');
// 	} catch (e) {
// 		return null;
// 	}
// }

// function getHistoricHeader3(historic) {
// 	try {
// 		return historic.querySelector('div > :nth-child(2) > h3');
// 	} catch (e) {
// 		return null;
// 	}
// }

// function getScale(historic) {
// 	try {
// 		return historic.querySelector('div > :nth-child(2) > div > div > svg > g > g:nth-child(2)').querySelectorAll('g');
// 	} catch (e) {
// 		return null;
// 	}
// }

// function getLimits(scale) {
// 	var min = +Infinity;
// 	var max = 0;
// 	scale.forEach((e) => {
// 		v = getValue(e);
// 		if (v < min) { min = v; }
// 		if (v > max) { max = v; }
// 	})
// 	return {lowest:min, highest:max};
// }

// function checkForClassElements(targetClass, desiredCount) {
// 	let observer = new MutationObserver(function(mutations) {
// 		for (var i = 0; i < mutations.length; i++) {
			// historic = getHistoric(); if (historic == null) { break; }
			// // console.log('got historic');
			// header = getHistoricHeader3(historic); if (header == null) { break; }
			// // console.log('got header');
			// scale = getScale(historic); if (scale == null) { break; }
			// // console.log('got scale');
			// graph = getGraph(historic); if (graph == null) { break; }
			// // console.log('got graph');
			// observer.disconnect();
			// requestAnimationFrame(() => {
				// document.querySelector(".profile-info__bg").scrollIntoView({ behavior: "instant", block: "start" });
				// var parentElement = document.querySelector('.parent-element');
				// parentElement.appendChild(elements[1]);
				// console.log(historic);
				// console.log(header);
				// console.log(scale);
				// console.log(graph);
			// 	limits = getLimits(scale);
			// 	header.textContent = header.textContent + ' (' + calculateSum(limits.lowest, limits.highest, graph.getAttribute('d')) + ')';
			// });
			// break;
	// 	}
	// });

	// document.querySelector(".title--page-extra-small").scrollIntoView({ behavior: "instant", block: "start" });
// 	observer.observe(document, { childList: true, subtree: true });
// };


// checkForClassElements('.line-chart__line', 3);


// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "runContentScript") {
//     	checkForClassElements('.line-chart__line', 3);
//     }
// });

