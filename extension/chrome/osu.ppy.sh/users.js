let url = null;

let baseURLs = {
	ppyOsuUsers : "https://osu.ppy.sh/users/"
};
if (window.location.href === url) { exit(0); }
url = window.location.href;

let fetchPromise = null;
let playerId = null;
let mode = null;
let locale = null;
let historical = null;
const playerInfos = {
	'osu': null,
	'taiko': null,
	'fruits': null,
	'mania': null
};

function parseUrl() {
	
	const startIndex = baseURLs.ppyOsuUsers.length;
	// console.log(startIndex )
	let endIndex = url.indexOf('/', startIndex);
	if (endIndex === -1) {
		playerId = url.substring(startIndex, url.length);
		mode = '';
		mode.length = 0;
	} else {
		playerId = url.substring(startIndex, endIndex);
		mode = url.substring(endIndex + 1, url.length);
	}
	endIndex = playerId.indexOf('#');
	if (endIndex !== -1) {
		playerId = playerId.substring(0, endIndex);
	}
	endIndex = mode.indexOf('#');
	if (endIndex !== -1) {
		mode = mode.substring(0, endIndex);
	}
	// console.log('parseUrl: playerId = ' + playerId);
	// console.log('parseUrl: mode = ' + mode);
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

function getUsername() {
	return document.querySelector("body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-info.profile-info--cover > div.profile-info__details > div.profile-info__info > h1 > span");
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
	const mode_text = mode === 'fruits' ? 'ctb' : mode;
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
	const entry = document.createElement('dl');
	entry.setAttribute('id', id);
	const key =  document.createElement('dt');
	const value =  document.createElement('dd');
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
	const tmp = await fetch(`${baseURLs.ppyOsuUsers}${playerId}/extra-pages/historical`);
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
		const res = await fetch(`${baseURLs.ppyOsuUsers}${playerId}/${mode}`);
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
	const customCss = document.createElement('style');
	// always takes 3s for one gradient to fully slide
	// shorter usernames will have longer times to make up for the short name
	const animationTime = 124/getUsername().offsetWidth*3;
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
	@keyframes slidingBackground {
		0% {
			background-position: 0 0;
		}

		100% {
			background-position: 100% 0;
		}
	}
	#username {
		background: linear-gradient(
			90deg,
			rgba(255, 0, 0, 1) 0%,
			rgba(255, 154, 0, 1) 5%,
			rgba(208, 222, 33, 1) 10%,
			rgba(79, 220, 74, 1) 15%,
			rgba(63, 218, 216, 1) 20%,
			rgba(47, 201, 226, 1) 25%,
			rgba(28, 127, 238, 1) 30%,
			rgba(95, 21, 242, 1) 35%,
			rgba(186, 12, 248, 1) 40%,
			rgba(251, 7, 217, 1) 45%,
			rgba(255, 0, 0, 1) 50%,
			rgba(255, 154, 0, 1) 55%,
			rgba(208, 222, 33, 1) 60%,
			rgba(79, 220, 74, 1) 65%,
			rgba(63, 218, 216, 1) 70%,
			rgba(47, 201, 226, 1) 75%,
			rgba(28, 127, 238, 1) 80%,
			rgba(95, 21, 242, 1) 85%,
			rgba(186, 12, 248, 1) 90%,
			rgba(251, 7, 217, 1) 95%,
			rgba(255, 0, 0, 1) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		text-shadow: initial;
		animation: slidingBackground ${animationTime}s linear infinite;
		background-size: 200% 100%;
	}
	`;

	document.head.appendChild(customCss);
}

function getCurrentGamemode() {
	const meta = document.querySelectorAll('head > meta[name="description"]');
	const content = Array.from(meta)[0].getAttribute('content');
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
		// console.log('addPlaceHolderHTML: mode = ' + mode);
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
		// console.log('entering fetchAll');
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
	const text = document.querySelector('html').getAttribute('lang');
	const startIndex = text.indexOf('currentLocale') + 'currentLocale'.length + 4;
	locale = text.substring(startIndex, text.indexOf('"', startIndex));
	// console.log('getLocale: locale = ' + locale);
}

async function addElements() {
	// console.log('entering addElements');
	
	addCustomCSS();
	addPlaceHolderHTML();
	addFun();

	if (true) {
		switchDaysAndHours();
	}
	const gameModes = getGameModes();

	// TO FIX: me! links to self, anywhere -> back, search bar, profile banner from home

	for (let buttonMode of Object.keys(playerInfos)) {
		gameModes.querySelector(`a[data-mode="${buttonMode}"]`).addEventListener('click', async (event) => {
			localStorage['comeFromModeButton'] = 'true';
			localStorage['targetMode'] = buttonMode;
			event.preventDefault();
			window.location.href = `${baseURLs.ppyOsuUsers}${playerId}/${buttonMode}`;
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
	if (msg === 'addElements'){
		addElements();
	}
});

// fun

function addFun() {
	if (playerId === '11103956' || playerId === '5146531') {
		getUsername().setAttribute('id', 'username');
	}
}

// async function updateUsername(username) {
// 	let hue = 0;
// 	let angle = 0;
// 	const radius = 100;
// 	let xOffset = 0;
// 	let yOffset = 0;
// 	let sign = 1;
// 	let scale = 1;
// 	while (true) {
// 		username.style = `color: hsl(${hue}, 100%, 50%); transform: rotate(${hue}deg) scale(${scale}) translate(${xOffset}px, ${yOffset}px);`;
// 		username.style = `color: hsl(${hue}, 100%, 50%);`;
// 		hue = (hue + 1) % 360;
// 		xOffset = radius * Math.cos(angle);
// 		yOffset = radius * Math.sin(angle);
// 		angle = (angle + 0.1) % 360;
// 		scale += sign / 360;
// 		if (scale >= 1.5) {
// 			sign = -sign;
// 			continue;
// 		}
// 		if (scale <= 0.5) {
// 			sign = -sign;
// 		}
// 		await new Promise(resolve => setTimeout(resolve, 10));
// 	}
// }
