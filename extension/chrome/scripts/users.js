
var upToDate = false;
var playerId = null;
var currentMode;
var locale;
var playersInfos;
var playerInfos;

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

var dom = {
	_playerId: null,
	_locale: null,
	_playerInfos: null,
	get playerId() { return this._playerId; },
	set playerId(playerId) { this._playerId = playerId; },

	get locale() { return this._locale; },
	set locale(locale) { this._locale = locale; },

	get playerInfos() { return this._playerInfos; },
	set playerInfos(playerInfos) { this._playerInfos = playerInfos; },

	getUsername() {
		return document.querySelector('body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-info.profile-info--cover > div.profile-info__details > div.profile-info__info > h1 > span');
	},

	addGlobalPlayTime(props) {
		let globalPlayTime = props[0].gpt + props[1].gpt + props[2].gpt + props[3].gpt;
		globalPlayTime = convertTime(globalPlayTime);

	
		const labelElements = document.querySelectorAll('.value-display__label');
		labelElements[4].innerText = `${currentMode} Playtime`;
		labelElements[4].style= 'text-transform: capitalize;';
		


		const outerDiv = document.createElement("div");
		outerDiv.classList.add("value-display", "value-display--plain", "value-display--plain-wide");
	
		const labelDiv = document.createElement("div");
		labelDiv.classList.add("value-display__label");
		labelDiv.textContent = "Total Playime";
		const valueDiv = document.createElement("div");
		valueDiv.classList.add("value-display__value");
		const spanElement = document.createElement("span");
		spanElement.setAttribute("data-tooltip-position", "bottom center");
		spanElement.setAttribute("title", `${globalPlayTime.hours} hours`);
		spanElement.textContent = globalPlayTime.string;
		valueDiv.appendChild(spanElement);
		outerDiv.appendChild(labelDiv);
		outerDiv.appendChild(valueDiv);
		document.querySelector('body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) > div:nth-child(3) > div.profile-detail__values.profile-detail__values--grid').appendChild(outerDiv);

	},
	

	
}

function getPlaycount() {
	return document.querySelector('body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div.profile-stats > dl.profile-stats__entry.profile-stats__entry--key-play_count');
}

function getProfileDetail() {
	return document.querySelector('body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) > div:nth-child(3)');
}

function getProfileDetailChartNumbers() {
	return document.querySelector('body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) > div:nth-child(3) > div.profile-detail__values.profile-detail__values--grid');
}

function getProfileRankNote() {
	return document.querySelector('body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) > div.profile-detail__chart-numbers.remakeProfilInfos > div:nth-child(2) > div');
}

function addProfileStat(parent, keyTextContent, valueTextContent) {
	var entry = document.createElement('dl');
	entry.setAttribute('id', 'v2datas');
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

class LS {
	constructor () {
		this.playerId = text.substring(startIndex, endIndex !== -1 ? endIndex : text.length);

	}
	getUserStat() {
		stats = localStorage.getItem(this.playerId);
	}
	setUserStat(statsArray) {
		localStorage.setItem(this.playerId, statsArray);
	}
}

async function addTotalPlaycount(playerInfos) {
	return new Promise(async (resolve, reject) => {
		const DOM = new dom();
		try {
			fetch(`https://osu.ppy.sh/users/${playerId}/extra-pages/historical`)
			.then(response => response.json())
			.then(data => {
				let totalPlaycountValue = 0;
				for (let e of data["monthly_playcounts"]) {
					totalPlaycountValue += parseInt(e["count"]);
				}
				let totalPlaycountEntry = addProfileStat(getPlaycount(), 'Total Play Count', totalPlaycountValue.toLocaleString(locale));
				addProfileStat(totalPlaycountEntry, 'Total Play Count V2', (parseInt(totalPlaycountValue) - parseInt(playerInfos[0].plc) - parseInt(playerInfos[1].plc) - parseInt(playerInfos[2].plc) - parseInt(playerInfos[3].plc)).toLocaleString(locale));
			})
			.catch(error => console.error("Error fetching data:", error));
		} catch(e){
			resolve(false);
			throw Error(e);
		}
	});
}

function getplayerId() {
	let text = window.location.href;
	startIndex = 'https://osu.ppy.sh/users/'.length;
	endIndex = text.indexOf('/', startIndex);
	playerId = text.substring(startIndex, endIndex === -1 ? text.length : endIndex);
}

function getCurrentGamemode() {
	let content = Array.from(document.querySelectorAll('head meta[name="description"]'))[0].getAttribute('content');
	currentMode = content.substring(content.indexOf('(') + 1, content.indexOf(')'));
}

function getLocale() {
	let text = document.querySelector('html').getAttribute('lang');
	let startIndex = text.indexOf('currentLocale') + 'currentLocale'.length + 4;
	locale = text.substring(startIndex, text.indexOf('"', startIndex));
}

// getPlayerInfos

function htmlDecode(input) {
	var doc = new DOMParser().parseFromString(input, "text/html");
	return doc.documentElement.textContent;
}

function RawHtmlToJson(content) {
	const startIndex = content.indexOf('data-initial-data="') + 'data-initial-data="'.length;
	content = content.substring(startIndex);
	const endIndex = content.indexOf('</div>') - 7;
	const jsonText = content.substring(0, endIndex);
	return JSON.parse(htmlDecode(jsonText));
}

async function getPlayerRaw(gamemode, playerId) {
	return new Promise(async (resolve, reject) => {
		try {
			fetch(`https://osu.ppy.sh/users/${playerId}/${gamemode}`).then(async (res) => {
				res.text().then((rawHTML)=> {
					let data_initial_data = RawHtmlToJson(rawHTML);
					console.log(data_initial_data);
					resolve(data_initial_data);
				})
			})
		} catch(e){
			throw Error(e);
		}
	})
}

async function getPlayerInfos() {
	let playerInfos = [];
	return new Promise(async (resolve, reject) => {
		for (let gamemode of ['osu', 'taiko', 'fruits', 'mania']) {
			playerInfos.push(await getPlayerRaw(gamemode, dom.playerId));
		}
		localStorage.setItem(dom.playerId, playerInfos);
		resolve(playerInfos);
	});
}

function addCustomCSS() {
	customCss = document.createElement('style');
	customCss.textContent = `
	.remakeGrid { 
		grid-template-columns: repeat(6,1fr);
		gap: 2px;
	}
	.remakeProfilInfos {
		gap: 0px;
	}
	.remakeRankNotes{
		margin-left: -17px;
	}
	`;

	document.head.appendChild(customCss);
}

function addPlaceHolderHTML() {
	playerInfos = localStorage.getItem(dom.playerId);
	if (playerInfos == null) {

	} else {
		addCustomHTML(playerInfos);
	}
}

function addCustomHTML() {

}

function updateHTML() {

}

async function addInfos() {
	console.log('entering main');

	getplayerId();
	console.log(playerId);

	addCustomCSS();
	
	playersInfos = localStorage["playersInfos"];

	if (playersInfos == null) {
		playerInfos = await getPlayerInfos();
		addPlaceHolderHTML();
		updateHTML();
		playersInfos = {playerId: playerInfos};
	}
	else {
		playerInfos = playersInfos[playerId];
		addCustomHTML();
		if (playerId != playerInfos.playerId) {
			playerInfos = await getPlayerInfos();
			updateHTML();
		}
	}
	localStorage["playersInfos"] = playersInfos;

	console.log(currentMode);
	console.log(locale);
}

function updatePlayerInfos() {
	upToDate = false;
	if (playerInfos == null) {
		localStorage["playerInfos"] = await getPlayerInfos();
		upToDate = true;
	} else {
		if (playerId != playerInfos.playerId) {
			playerInfos = await getPlayerInfos();
		}
		localStorage["playersInfos"] = playersInfos;
		upToDate = true;
	}
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	playerId = getplayerId();
	if (request.action === 'addPlayerInfos') {
		addPlayerInfos();
	} else if (request.action === 'updatePlayerInfos') {
		updatePlayerInfos();
	}
})


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

