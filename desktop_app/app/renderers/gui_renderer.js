var sortOrders = [
	{
		balise: "PP",
		icon: "bars-arrow-down",
		order: "desc",
		name: "PP"

	},
	{
		balise: "PP",
		icon: "bars-arrow-up",
		order: "asc",
		name: "PP"

	},
	{
		balise: "accuracy",
		icon: "bars-arrow-down",
		order: "desc",
		name: "Accuracy"

	},
	{
		balise: "accuracy",
		icon: "bars-arrow-up",
		order: "asc",
		name: "Accuracy"

	},
	{
		balise: "date",
		icon: "bars-arrow-down",
		order: "desc",
		name: "Date"

	},
	{
		balise: "date",
		icon: "bars-arrow-up",
		order: "asc",
		name: "Date"

	},
	{
		balise: "note",
		icon: "bars-arrow-down",
		order: "desc",
		name: "Note"

	},
	{
		balise: "note",
		icon: "bars-arrow-up",
		order: "asc",
		name: "Note"

	},
]
var bindKeys = {
	"TAB": "⇥",
	"CAPSLOCK": "⇪",
	"SHIFT": "⇧",
	"CONTROL": "CTRL",
	"ARROWUP": "⮝",
	"ARROWDOWN": "⮟",
	"ARROWLEFT": "⮜",
	"ARROWRIGHT": "⮞",
	"DELETE": "DLT",
	"INSERT": "INS",
	"PAGEDOWN": "⇟",
	"PAGEUP": "⇞",
	"SPACE": "⎵",
	"ALTGRAPH": "ALTGR",
	"ESCAPE": "ESC"
}
let previousValues = {
	"0": 0,
	"50": 0,
	"100": 0,
	"300": 0,
	"geki": 0,
	"katu": 0,
	"sliderBreaks": 0,
}

const ReconnectingWebSocket = require('../server/gosumemory_handler');
const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);
const { ipcRenderer } = require('electron');
const BPDPC = require('osu-bpdpc');
const { json } = require('express');


let currentIndex = 0;
var hitErrorArrayTab
var key1ArrayHits = []
var key2ArrayHits = []
var settingsFile = null
var ts = 0
var playing = false
var wsData = null
var KeysImput = null
var basic_infos
var gameplay
var missChecker = {Miss: 0, checked: false}
var sbChecker = {SB: 0, checked: false}

ipcRenderer.on('settings', (event, data)=>{
	loadSettings(data)
	console.log(data)
})

function sortScoreList() {
	const listContainer = document.querySelector('.list-score');
	const sortedBySpan = document.querySelector('.sorted-by');
	const icon = sortedBySpan.querySelector('m');

	currentIndex = (currentIndex + 1) % sortOrders.length;
	const sortOrder = sortOrders[currentIndex];

	let itemsArray = Array.from(listContainer.getElementsByClassName('toprank-element'));
	itemsArray.sort((a, b) => {
		let c, d;
		switch (sortOrder.balise) {
			case "PP":
				c = parseFloat(a.dataset.pp);
				d = parseFloat(b.dataset.pp);
				break;
			case "accuracy":
				c = parseFloat(a.dataset.accuracy);
				d = parseFloat(b.dataset.accuracy);
				break;
			case "date":
				c = parseFloat(a.dataset.timestamp);
				d = parseFloat(b.dataset.timestamp);
				break;
			case "note":
				c = parseInt(a.dataset.note, 10);
				d = parseInt(b.dataset.note, 10);
				break;
		}
		if (sortOrder.balise === "note") {

			return sortOrder.order === "desc" ? c - d : d - c;
		} else {
			return sortOrder.order === "asc" ? c - d : d - c;
		}
	});

	itemsArray.forEach(item => listContainer.appendChild(item));

	// Mise à jour du texte et de l'icône du bouton
	sortedBySpan.innerHTML = `Sort By ${sortOrder.name} <m class="${sortOrder.icon} white"></m>`;
}
document.querySelector('.sorted-by').addEventListener('click', sortScoreList);

let settings = {
	setLanguage: 'EN',
	setMinimizeWindow: "yes",
	setTheme: 'dark',
	setDisplayNumber: '1ms',
	setSubmitScore: 'ap',
	setAutoUpdate: 'dl',
	folderPathStable: 'C:\Users\fareo\AppData\Local\osu!',
	folderPathLazer: 'Not Setup',
	setDownloadMapsCollection: 'sa',
	setDownloadMapsSpectacle: 'sa',
	IRCUsername: null,
	IRCPassword: null,
	setScanosuFiles: 'yes',
	setMusicSync: 'al',
}

console.log(settings)


//Pages Collectors
var PageCollector = []

//Toggles 
let left_menuToggle = true
let settings_page_toggled = "settings_general"
let global_page_toggled = "gameplay_page"
let GamemodeToggle = "STD"

//Global
var os = false

//Placeholders
let stat_CountryRank = document.getElementById('stat_CountryRank')

let stat_GlobalRank = document.getElementById('stat_GlobalRank')
let stat_ClassedScore = document.getElementById('stat_ClassedScore')
let stat_Accuracy = document.getElementById('stat_Accuracy')
let stat_PlayCount = document.getElementById('stat_PlayCount')
let stat_TotalScore = document.getElementById('stat_TotalScore')
let stat_Clicks = document.getElementById('stat_Clicks')
let stat_MasterSkillset = document.getElementById('stat_MasterSkillset')
let stats_MaxCombo = document.getElementById('stat_ComboMax')
let stat_AIM = document.getElementById('stat_AIM')
let stat_Graph = document.getElementById('stat_Graph')
let stats_refresh_dt = document.getElementById('stats_refresh_dt')


let playerInfo_Username = document.getElementById('playerInfo_Username')
let playerInfo_GamePreference = document.getElementById('playerInfo_GamePreference')
let playerInfo_AvatarUrl = document.getElementById('playerInfo_AvatarUrl')

let isSupporter = document.getElementById('playerInfo_isSupporter')

let software_info = document.getElementById('software_info')

//Gameplay Beatmaps infos
let ph_beatmapBg = null
let ph_currentTimeStamp = null
let ph_totalTimeStamp = null
let ph_ar = null
let ph_sr = null
let ph_od = null
let ph_hp = null
let ph_keycount = null
let ph_creator = null
let ph_rankedStatus = null
let ph_rankedDt = null
let ph_submitDt = null
let ph_skillsets = null
let ph_bmid = null
let ph_bmsetid = null
let ph_gamemode = null
let ph_author = null
let ph_difficultyName = null
let ph_rating = null
let ph_globalPlayCount = null
let ph_ratePassed = null
let ph_maxCombo = null
let ph_asSpiners = null


//Actions-btn
let action_RefreshDataScores = document.getElementById('action_RefreshDataScores')

//Contents Elements
let left_menu = document.getElementById('side_left_menu');
let content = document.getElementById('main-content')
let boxInfo = document.querySelector('.over-info');
let scores = document.querySelectorAll('.toprank-element')
let notificationBox = document.getElementById('notification-box')

//Dynamic Events

function loadSettings(data) {
	Object.entries(data).forEach(([key, value]) => {
		let settingBtn = document.querySelectorAll(`[data-event="${key}"]`);
		settingBtn.forEach(function (element) {
			if (element.getAttribute('data-option') === value) {
				element.classList.add('active');

			} else {
				element.classList.remove('active');
			}
		});
	})
}


//Create Collection
document.getElementById('createCollectionBtn').addEventListener('click', function () {
	let CollectionList = document.getElementById('lcollection')

	let collectionElement = document.createElement('div');
	collectionElement.classList.add('collection-name');
	collectionElement.classList.add('added')

	let span = document.createElement('span');
	let input = document.createElement('input');
	input.setAttribute('type', 'text');
	input.setAttribute('placeholder', 'Enter a collection name');
	span.appendChild(input);

	let m1 = document.createElement('m');
	let m2 = document.createElement('m');

	m1.classList.add('check');
	m1.classList.add('soft-green');
	m2.classList.add('arrow-uturn-left');
	m2.classList.add('soft-red');

	m1.setAttribute('data-event', 'info');
	m2.setAttribute('data-event', 'info');
	m1.setAttribute('data-info', 'Save');
	m2.setAttribute('data-info', 'Cancel');

	collectionElement.appendChild(span)
	collectionElement.appendChild(m1)
	collectionElement.appendChild(m2)

	CollectionList.insertBefore(collectionElement, (CollectionList.children[1]));
	setTimeout(() => {
		collectionElement.classList.remove('added')

	}, 40);
	input.focus();

	input.addEventListener('blur', function () {
		m1.classList.add('pencil-square');
		m1.classList.remove('soft-green');
		m1.classList.add('glass-grey');
		m2.classList.add('folder-minus');
		m2.classList.add('soft-red');
	});

	function SaveNewCollection() {
		m1.setAttribute('data-info', 'Edit name');
		m2.setAttribute('data-info', 'Delete');
		input.disabled = true
		//Write Collection in collection.db
	}

	document.addEventListener('keydown', function (event) {
		if (event.key === 'Enter') {
			SaveNewCollection()
			document.removeEventListener('keydown');
		}
	})

	m1.addEventListener('click', function () {
		SaveNewCollection()
	});

	m2.addEventListener('click', function (event) {
		CollectionList.removeChild(collectionElement);
		boxInfo.classList.remove('show');
	});
	m1.addEventListener('mouseover', function (event) {
		handleMouseOver(event, m1);
	});
	m1.addEventListener('mouseout', handleMouseOut);

	m2.addEventListener('mouseover', function (event) {
		handleMouseOver(event, m2);
	});
	m2.addEventListener('mouseout', handleMouseOut);
})
function switchMode(mode) {
	document.querySelectorAll('.modeswtichBtn').forEach(function (element) {
		element.classList.remove('active')
		document.getElementById(`modeBtn${mode}`).classList.add('active')

		stat_CountryRank.innerText = ''
		stat_GlobalRank.innerText = ''
		stat_ClassedScore.innerText = ''
		stat_Accuracy.innerText = ''
		stat_PlayCount.innerText = ''
		stat_TotalScore.innerText = ''
		stat_Clicks.innerText = ''
		stat_MasterSkillset.innerText = ''
		stat_AIM.innerText = ''
		stats_MaxCombo.innerText = ''
		// stat_Graph = null
	})
}



document.querySelectorAll('.btn').forEach(function (btn) {
	btn.addEventListener('click', function () {
		// loadSettings()
		let siblings = btn.closest('.setting-element').querySelectorAll('.btn');
		if (!btn.getAttribute('data-privilege')) {
			siblings.forEach(function (sibling) {
				sibling.classList.remove('active');
			});
			btn.classList.add('active');

			let value = btn.getAttribute('data-option')
			let event = btn.getAttribute('data-event')
			switch (event) {
				case 'setLanguage':
					console.log('test')
					//EN = EN

					break;
				case 'setMinimizeWindow':
					//yes = yes
					//no = no

					break;
				case 'setTheme':
					//dark = dark
					//light = light

					break;
				case 'setDisplayNumber':
					//100s = 100 space
					//1ks = 1000 space
					//1ms = 1000000 space
					document.querySelectorAll('.number').forEach(function (element) {
						let number = parseFloat(element.getAttribute('data-value').replace(/\s/g, ''));

						let formattedNumber = '';
						console.log(btn.getAttribute('data-option'))
						switch (btn.getAttribute('data-option')) {
							case '100s':
								formattedNumber = number.toLocaleString('fr-FR');
								break;
							case '1ks':
								if (number <= 9999) {
									formattedNumber = number.toLocaleString('fr-FR');
								} else {
									formattedNumber = ((number / 1000).toFixed(0)).toLocaleString('fr-FR', { maximumFractionDigits: 0, minimumFractionDigits: 1 }).replace(' ', ',');
									let ks = parseFloat(formattedNumber)
									ks = ks.toLocaleString('fr-FR');
									formattedNumber = ks + " k"
								}
								break;
							case '1ms':
								formattedNumber = (number / 1000000).toLocaleString('fr-FR') + " M";
								break;
							default:
								console.log('default')
								formattedNumber = number.toString();
						}

						element.innerText = formattedNumber
					});


					break;
				case 'setSubmitScore':
					//ap = after playing
					//30m = 30 min
					//1h = 1h
					//al = after launching

					break;
				case 'setAutoUpdate':
					//dl = during launching
					//manually = manually
					//never = never

					break;
				case 'setOsuFolderStable':
					ipcRenderer.send('open-directory-dialog', 'folderPathStable');
					break;
				case 'setOsuFolderLazer':
					ipcRenderer.send('open-directory-dialog', 'folderPathLazer');
					break;
				case 'setDownloadMapsCollection':
					//sa = self-acting
					//manually = manually

					break;
				case 'setDownloadMapsSpectacle':
					//no = no
					//manually = manually
					//sa = self-acting

					break;
				case 'logout':
					//  osu or irc

					break;
				case 'setScanosuFiles':
					//yes = yes
					//no = no

					break;
				case 'setMusicSync':
					//al = after launching
					//manually = manually
					//1h = every 1h
					//1d = every 1d

					break;
				case 'Reset':
				break;
				default:
				break;
			}
		} else {
			showNotificationBox('Please subscribe Osu!Supporter for enable this option', 'info')
		}
	});
});
ipcRenderer.on('selected-directory', (event, pathId, path) => {
    document.getElementById(pathId).value = path;
});
ipcRenderer.on('file-check-failed', (event, pathId) => {
    showNotificationBox('Please select an Osu! Folder', 'warning')
});

//Dynamic UI

//Show a notification
function showNotificationBox(content, type) {

	notificationBox.style.left = '1145px';
	let icon = null
	let color = null
	switch (type) {
		case 'warning':
			icon = "exclamation-triangle"
			color = "soft-red"
			break;
		case 'dl':
			icon = "document-arrow-down"
			color = "soft-green"
			break;
		case 'info':
			icon = "information-circle"
			color = "white"
			break;
	}

	document.getElementById('notifIcon').classList.add(icon)
	document.getElementById('notifIcon').classList.add(color)

	document.getElementById('notifLabel').innerText = content
	setTimeout(() => {
		notificationBox.style.left = '1400px';
	}, 5000);
}

//Settings Menu 
left_menu.addEventListener('click', function (event) {
	if (event.target.getAttribute('id') == 'side_left_menu' &&
		event.offsetX >= left_menu.offsetWidth - 12) {
		if (left_menuToggle) {
			left_menu.classList.add('hide');
			content.classList.add('full')
			left_menu.style.setProperty('--after-content', '""')
			setTimeout(() => {
				left_menu.style.setProperty('--after-content', '"❭"')
				left_menu.style.setProperty('--after-content-width-left', '1%')
				left_menuToggle = false
			}, 150);
		} else {
			left_menu.classList.remove('hide');
			content.classList.remove('full')
			left_menu.style.setProperty('--after-content', '""')
			setTimeout(() => {
				left_menu.style.setProperty('--after-content', '"❬"')
				left_menu.style.setProperty('--after-content-width-left', '13.4%')
				left_menuToggle = true
			}, 150)
		}
	}
});
document.getElementById("settings_menu").addEventListener("click", function (event) {
	if (event.target.classList.contains("navigate-page")) {
		if (!event.target.classList.contains('active')) {
			let target = event.target.getAttribute('target')

			let oldToggle = settings_page_toggled
			settings_page_toggled = target
			setTimeout(() => {
				document.querySelector(`div[target=${oldToggle}]`).classList.remove('active')
				document.getElementById(oldToggle).classList.remove('active')
				document.getElementById(target).classList.add('active')
				event.target.classList.add('active')
			}, 50);
		}
	}
});

//Global Menu 
document.querySelectorAll('.menuBtn').forEach(function (element) {
	element.addEventListener('click', function (event) {
		if (element.getAttribute('disabled')) {
			showNotificationBox(tr('This page is not available'), 'warning')
			return
		}
		if (!element.classList.contains('active')) {

			let target = element.getAttribute('target')
			let oldToggle = global_page_toggled
			global_page_toggled = target
			setTimeout(() => {
				if(global_page_toggled === "gameplay_page"){
					document.getElementById('root').classList.add('bg-img')
					document.getElementById('main-content').classList.add('nocolor')
				} else {
					document.getElementById('root').classList.remove('bg-img')
					document.getElementById('main-content').classList.remove('nocolor')

				}
				document.querySelector(`div[target=${oldToggle}]`).classList.remove('active')
				element.classList.add('active')
				document.getElementById(oldToggle).classList.add('no-toggle')
				document.getElementById(target).classList.remove('no-toggle')
			}, 50);
		}
	})

});

//Show context Menu
function showScoreContextMenu(element) {
	document.querySelector('.context-menu').classList.add('show')
	function createBtn(label, action, targetID) {

		let div = document.createElement('div')
		div.classList.add('button-context')
		div.textContent = label
		if (action === "cancel") {
			div.onclick = function () {
				document.querySelector('.context-menu').classList.remove('show')
				document.querySelector('.context-menu').innerHTML = ""
			}
		} else {
			div.onclick = function () {
				window.open(`${action}/${targetID}`, '_blank');
			}
		}

		document.querySelector('.context-menu').appendChild(div)
	}

	createBtn('View Thread', 'https://osu.ppy.sh/beatmaps', element.getAttribute('data-bmid'))
	createBtn('Open in Osu!', 'osu://b', element.getAttribute('data-bmid'))
	createBtn('View Score', 'https://osu.ppy.sh/scores', element.getAttribute('data-scoreid'))
	createBtn('Share Score', '', element.getAttribute('data-scoreid'))
	createBtn('Cancel', 'cancel', null)

}
scores.forEach(function (element) {
	element.addEventListener('click', function () {
		showScoreContextMenu(element);
	});
});

//MiniBox Info
function calcHeight(text) {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	context.font = `16px sans-serif`;
	context.letterSpacing = 1;
	const coefficient = context.measureText(text).width / 250;
	return 35 * coefficient + 'px';
}
function handleMouseOver(event, element) {
	boxInfo.innerHTML = element.getAttribute('data-info')
	updateBoxInfoPosition(event.clientX, event.clientY, calcHeight(element.getAttribute('data-info')));
	boxInfo.classList.add('show')



	element.addEventListener('mousemove', function (event) {
		handleMouseMove(event, calcHeight(element.getAttribute('data-info')));
	});

}
function handleMouseMove(event, height) { updateBoxInfoPosition(event.clientX, event.clientY, height); }
function handleMouseOut(event) {
	boxInfo.classList.remove('show')
	console.log('quit')
}
function updateBoxInfoPosition(x, y, estimatedHeight) {
	boxInfo.style.height = estimatedHeight
	const boxInfoWidth = boxInfo.offsetWidth;
	boxInfo.style.left = (x - boxInfoWidth - 10) + 'px';
	boxInfo.style.top = y + 'px';
}
document.querySelectorAll('[data-event="info"]').forEach(function (element) {
	element.addEventListener('mouseover', function (event) {
		handleMouseOver(event, element);
	});
	element.addEventListener('mouseout', handleMouseOut);
});
function handleMouseOut(event) { boxInfo.classList.remove('show'); }





//Dynamic Bella Fiora with backend

/*
* Renewal of data in play in the dom
*/
	var pollrateGameplay = 250

//Api gestion
ipcRenderer.on('api', (event, data) => {
	if (data.event === 'createHTMLObject') {
		document.getElementById('endOfNav').insertAdjacentHTML('afterend', data.HTML);
	}
});
global.pluginInterface = { getWindow: () => window }

/**
** All the dynamic part for device management and communications
*  Mainly manages the keypads
*/
	ipcRenderer.on('newDevice', (event, data) => {
		showNotificationBox(`${data.model} Connected`, "info")

		document.getElementById('noDevice').classList.add('noshow')
		document.getElementById('deviceInfos').classList.remove('noshow')

		document.getElementById('deviceName').innerText = data.model
		if (data.keys === 2) {
			document.getElementById('keyBindList').innerHTML = `
			<div class="btn keybind" onClick="setInputKey(1)" data-value="Q" id="key1">Q</div>
			<div class="btn keybind" onClick="setInputKey(2)" data-value="S" id="key2">S</div>
			<div class="btn" data-event="setInputDefaultOsu">Set Osu! Keys</div>
			`
		} else {
			document.getElementById('keyBindList').innerHTML = `
			<div class="btn keybind" onClick="setInputKey(1)" data-value="D" id="key1">D</div>
			<div class="btn keybind" onClick="setInputKey(2)" data-value="F" id="key2">F</div>
			<div class="btn keybind" onClick="setInputKey(3)" data-value="J" id="key3">J</div>
			<div class="btn keybind" onClick="setInputKey(4)" data-value="K" id="key4">K</div>
			<div class="btn" data-event="setInputDefaultOsu">Set Osu! Keys</div>
			`
		}
	})
	ipcRenderer.on('deviceDisconnected', (event, data) => {
		showNotificationBox(`${data} Disconnected`, "info")
		document.getElementById('keyBindList').innerHTML = ''
		document.getElementById('noDevice').classList.remove('noshow')
		document.getElementById('deviceInfos').classList.add('noshow')
	})

	function setInputKey(keyNumber) {
		document.getElementById(`keySelect`).innerText = document.getElementById(`key${keyNumber}`).innerHTML
		console.log(keyNumber);
		document.getElementById('changeKeyBind').classList.add('show');
		let key = document.getElementById(`key${keyNumber}`).innerHTML;

		function handleKeyDown(event) {
			console.log(document.getElementById(`key${keyNumber}`).innerHTML)

			if (event.key === "Enter") {

				document.getElementById('changeKeyBind').classList.remove('show');
				document.getElementById(`key${keyNumber}`).innerText = key;
				document.removeEventListener('keydown', handleKeyDown); // Retirer l'écouteur
				console.log("Key binding completed and listener removed.");
			} else {
				console.log(event);

				key = event.key;

				if (event.code === "Space") {
					key = "space";
				}
				key = bindKeys[key.toUpperCase()] || key.toUpperCase();
				isSelected = true;

				document.getElementById(`keySelect`).innerText = key
			}
		}

		document.addEventListener('keydown', handleKeyDown);
	}


/**
** Update Users datas
*/
	ipcRenderer.on('player-data', (event, data) => {
		const player_data = data
		basic_infos = player_data.basic_informations
		gameplay = player_data.gameplay
		// IntroduceDataPlayer(basic_infos.playmode)
	})

	async function IntroduceDataPlayer(defaultMod = false) {
		var defaultMod

		if (!defaultMod) {
			defaultMod = (basic_infos.playmode === 'osu') ? 0 : (basic_infos.playmode === 'mania') ? 3 : (basic_infos.playmode === 'ctb') ? 2 : (basic_infos.playmode === 'taiko') ? 1 : '?';
		}
		else {
			defaultMod = (defaultMod === 'osu') ? 0 : (defaultMod === 'mania') ? 3 : (defaultMod === 'ctb') ? 2 : (defaultMod === 'taiko') ? 1 : '?';
		}
		console.log(defaultMod)
		document.getElementById('userAvatar').src = basic_infos.avatar_url
		document.getElementById('welcomePseudo').innerText = basic_infos.username
		document.getElementById('welcomeRank').innerText = `Rank: ${gameplay['m' + defaultMod].global_rank} (${gameplay['m' + defaultMod].country_rank} ${basic_infos.country})`
		document.getElementById('welcomePP').innerText = `${parseInt(gameplay['m' + defaultMod].pp)} PP`
		document.getElementById('userStat_classedPlays').innerText = `${gameplay['m' + defaultMod].plays_count}`;
		document.getElementById('userStat_TotalScore').innerText = `${gameplay['m' + defaultMod].total_score}`;
		document.getElementById('userStat_Accuracy').innerText = `${(parseFloat(gameplay['m' + defaultMod].accuracy)).toFixed(2)} %`;
		document.getElementById('userStat_nbClick').innerText = `${gameplay['m' + defaultMod].clicks}`;
		document.getElementById('userStat_maxCombo').innerText = `${gameplay['m' + defaultMod].combo_max}`

		document.getElementById('userStat_nb_ssh').innerText = `${gameplay['m' + defaultMod].notes.ssh}`;
		document.getElementById('userStat_nb_ss').innerText = `${gameplay['m' + defaultMod].notes.ss}`;
		document.getElementById('userStat_nb_sh').innerText = `${gameplay['m' + defaultMod].notes.sh}`;
		document.getElementById('userStat_nb_s').innerText = `${gameplay['m' + defaultMod].notes.s}`;
		document.getElementById('userStat_nb_a').innerText = `${gameplay['m' + defaultMod].notes.a}`;
		console.log(gameplay['m' + defaultMod].top_rank)
		rankHistoryUpdate(gameplay['m' + defaultMod].history_rank)
	}


/*
*  Declaration by the websockets 
*/
	let tosuWebSocket = new ReconnectingWebSocket('ws://127.0.0.1:24050/ws');
	let tosuWebSocketKeys = new ReconnectingWebSocket('ws://127.0.0.1:24050/websocket/v2/precise');
	tosuWebSocket.onopen = (event) => console.log(event);
	tosuWebSocketKeys.onopen = (event) => console.log(event);


/*
*  Events of websockets
*/
	tosuWebSocket.onclose = event => {tosuWebSocket.send('Client Closed!');};
	tosuWebSocketKeys.onclose = event => {tosuWebSocket.send('Client Closed!');};
	tosuWebSocket.onerror = error => console.log('Socket Error: ', error);
	tosuWebSocketKeys.onerror = error => console.log('Socket Error: ', error);


/*
*  Recovery of data from websockets
*/
	tosuWebSocketKeys.onmessage = event => {
		KeysImput = JSON.parse(event.data)
	}
	tosuWebSocket.onmessage = event => {
		let data = JSON.parse(event.data)
		wsData = data
		if (ts !== data.menu.bm.time.current && data.gameplay.name) {
			playing = true
		}
		else { playing = false } ts = data.menu.bm.time.current
		// console.log(playing)
	}


/*
*  Pages translations
*/
	let translations = {};
	document.addEventListener('DOMContentLoaded', async () => {
		ipcRenderer.send('getLang')
		ipcRenderer.on('lang', (lg, dictionnary) => {
			translations = JSON.parse(dictionnary)
			updateTranslations()
		})
	});
	function updateTranslations() {
		document.querySelectorAll('trs').forEach(elem => {
			const key = elem.innerHTML
			elem.innerHTML = tr(key);
		});
	}
	function tr(key) {
		// return translations[key] || "<err>"+key+"</err>"
		return translations[key] || key

	}





// 		let hp = document.getElementById('bm_stats_hp')
// 		let od = document.getElementById('bm_stats_od')
// 		let cs = document.getElementById('bm_stats_cs')
// 		let sr = document.getElementById('bm_stats_sr')
// 		let ar = document.getElementById('bm_stats_ar')
// 		let kc = document.getElementById('bm_stats_kc')

// 		switch (bm.gameMode) {
// 		case 0:
// 			document.getElementById('bm_stats_handler_hp')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_od')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_cs')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_sr')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_ar')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_kc')
// 				.classList.add('unsued')
// 			hp.innerText = bm.bm.stats.HP
// 			od.innerText = bm.bm.stats.OD
// 			cs.innerText = bm.bm.stats.CS
// 			ar.innerText = bm.bm.stats.AR
// 			sr.innerText = bm.bm.stats.SR
// 			hp.style.width = `${Math.min((bm.bm.stats.HP / 10) * 100)}%`
// 			od.style.width = `${Math.min((bm.bm.stats.OD / 10) * 100)}%`
// 			cs.style.width = `${Math.min((bm.bm.stats.CS / 10) * 100)}%`
// 			ar.style.width = `${Math.min((bm.bm.stats.AR / 10) * 100)}%`
// 			sr.style.width = `${Math.min((bm.bm.stats.SR / 20) * 100)}%`
// 			break;
// 		case 1:
// 			document.getElementById('bm_stats_handler_hp')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_od')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_cs')
// 				.classList.add('unsued')
// 			document.getElementById('bm_stats_handler_sr')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_ar')
// 				.classList.add('unsued')
// 			document.getElementById('bm_stats_handler_kc')
// 				.classList.add('unsued')
// 			hp.innerText = bm.bm.stats.HP
// 			od.innerText = bm.bm.stats.OD
// 			sr.innerText = bm.bm.stats.SR
// 			hp.style.width = `${Math.min((bm.bm.stats.HP / 10) * 100)}%`
// 			od.style.width = `${Math.min((bm.bm.stats.OD / 10) * 100)}%`
// 			sr.style.width = `${Math.min((bm.bm.stats.SR / 20) * 100)}%`
// 			break;
// 		case 2:
// 			document.getElementById('bm_stats_handler_hp')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_od')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_cs')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_sr')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_ar')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_kc')
// 				.classList.add('unsued')
// 			hp.innerText = bm.bm.stats.HP
// 			od.innerText = bm.bm.stats.OD
// 			cs.innerText = bm.bm.stats.CS
// 			ar.innerText = bm.bm.stats.AR
// 			sr.innerText = bm.bm.stats.SR
// 			hp.style.width = `${Math.min((bm.bm.stats.HP / 10) * 100)}%`
// 			od.style.width = `${Math.min((bm.bm.stats.OD / 10) * 100)}%`
// 			cs.style.width = `${Math.min((bm.bm.stats.CS / 10) * 100)}%`
// 			ar.style.width = `${Math.min((bm.bm.stats.AR / 10) * 100)}%`
// 			sr.style.width = `${Math.min((bm.bm.stats.SR / 20) * 100)}%`
// 			break;
// 		case 3:
// 			document.getElementById('bm_stats_handler_hp')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_od')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_cs')
// 				.classList.add('unsued')
// 			document.getElementById('bm_stats_handler_sr')
// 				.classList.remove('unsued')
// 			document.getElementById('bm_stats_handler_ar')
// 				.classList.add('unsued')
// 			document.getElementById('bm_stats_handler_kc')
// 				.classList.remove('unsued')
// 			hp.innerText = bm.bm.stats.HP
// 			od.innerText = bm.bm.stats.OD
// 			sr.innerText = bm.bm.stats.SR
// 			hp.style.width = `${Math.min((bm.bm.stats.HP / 10) * 100)}%`
// 			od.style.width = `${Math.min((bm.bm.stats.OD / 10) * 100)}%`
// 			sr.style.width = `${Math.min((bm.bm.stats.SR / 20) * 100)}%`
// 			break;
// 		}
// 		musicPlayer.classList.remove('music__player__offline')
// 	})



//   ipcRenderer.on(
// 	  'fader', (event, fader) => { document.body.classList.add(fader) })
//   ipcRenderer.on('initGUI', async (event, data) => {
// 	  const defaultMod = data.playmode
// 	  document.getElementById('userAvatar').src = data.avatar_url;
// 	  document.getElementById('welcomePseudo').innerText = data.username;
// 	  document.getElementById('welcomeRank').innerText = `Rank: ${data.statistics_rulesets[defaultMod].global_rank} (${
// 		  data.statistics.rank.country} ${data.country_code})`
// 	  document.getElementById('welcomePP').innerText = `${parseInt(data.statistics_rulesets[defaultMod].pp)} PP`
// 	  document.getElementById('userStat_classedScore').innerText = `${data.statistics.ranked_score}`;
// 	  document.getElementById('userStat_classedPlays').innerText = `${data.statistics.play_count}`;
// 	  document.getElementById('userStat_TotalScore').innerText = `${data.statistics.total_score}`;
// 	  document.getElementById('userStat_Accuracy').innerText = `${(data.statistics.hit_accuracy).toFixed(2)} %`;
// 	  document.getElementById('userStat_nbClick').innerText = `${data.statistics.total_hits}`;
// 	  document.getElementById('userStat_maxCombo').innerText = `${data.statistics.maximum_combo}`

// 	  document.getElementById('userStat_nb_ssh').innerText = `${data.statistics.grade_counts.ssh}`;
// 	  document.getElementById('userStat_nb_ss').innerText = `${data.statistics.grade_counts.ss}`;
// 	  document.getElementById('userStat_nb_sh').innerText = `${data.statistics.grade_counts.sh}`;
// 	  document.getElementById('userStat_nb_s').innerText = `${data.statistics.grade_counts.s}`;
// 	  document.getElementById('userStat_nb_a').innerText = `${data.statistics.grade_counts.a}`;
// 	  rankHistoryUpdate(data.rank_history.data)
//   })



setTimeout(() => {
	setInterval(async () => {

		const keysToCheck = ["0", "50", "100", "300", "geki", "katu"];

		keysToCheck.forEach(key => {

			if (wsData.gameplay.hits[key] !== previousValues[key]) {
				console.log(`Change detected in ${key}: ${previousValues[key]} -> ${wsData.gameplay.hits[key]}`);
				switch(key){
					case '300':
						ipcRenderer.send('keypadSend', 'faed3ff8');
					break
					case 'geki':
						ipcRenderer.send('keypadSend','14e742f8');
					break
					case 'katu':
						ipcRenderer.send('keypadSend', '2529ffde');
					break
					case "100" : 
					ipcRenderer.send('keypadSend', 'aa5b00f8');
					break
					case "50" : 
					ipcRenderer.send('keypadSend', '820cb1f8');
					break;
					case "0": 
					ipcRenderer.send('keypadSend', 'ff2828f8');
					break;

				}
				previousValues[key] = wsData.gameplay.hits[key];
			}
		})



		document.getElementById('currentTimeMusic').innerText = ctm(wsData.menu.bm.time.current,wsData.menu.bm.time.full)
		document.getElementById('totalTimeMusic').innerText = ctm(wsData.menu.bm.time.full, wsData.menu.bm.time.full)
		
		let backgroundCurrentMap = document.getElementById('backgroundCurrentMap')

		if(backgroundCurrentMap.getAttribute('src') !== `${wsData.settings.folders.songs}\\${wsData.menu.bm.path.full}`){
			backgroundCurrentMap.setAttribute('src', `${wsData.settings.folders.songs}\\${wsData.menu.bm.path.full}`)
			var basePath = wsData.settings.folders.songs.replace(/\\/g, '/'); 
			var imagePath = wsData.menu.bm.path.full.replace(/\\/g, '/'); 
			var fullUrl = encodeURI(`${basePath}/${imagePath}`);
			document.getElementById('root').style.backgroundImage = `url('${fullUrl}')`;
		}
		// console.table(wsData.gameplay.hits)
		// if()
		// 	  updateProgressBar(
		// 		  wsData.menu.bm.time.current, wsData.menu.bm.time.full);
		// 	  document.getElementById('timeElapsed').innerHTML = `
		// <span>${
		// 		  ctm(wsData.menu.bm.time.current,
		// 			  wsData.menu.bm.time.full)}</span>-<span>${
		// 		  ctm(wsData.menu.bm.time.full, wsData.menu.bm.time.full)}</span>`
		// 	  document.getElementById('MusictimeElapsed').innerHTML = `
		// <span>${
		// 		  ctm(wsData.menu.bm.time.current,
		// 			  wsData.menu.bm.time.mp3)}</span>-<span>${
		// 		  ctm(wsData.menu.bm.time.mp3, wsData.menu.bm.time.mp3)}</span>
		// `

		// 	  document.getElementById('gameplayStat_300_g').innerText = fnws(wsData.gameplay.hits.geki)
		// 	  document.getElementById('gameplayStat_300').innerText = fnws(wsData.gameplay.hits['300'])
		// 	  document.getElementById('gameplayStat_200').innerText = fnws(wsData.gameplay.hits.katu)
		// 	  document.getElementById('gameplayStat_100').innerText = fnws(wsData.gameplay.hits['100'])
		// 	  document.getElementById('gameplayStat_50').innerText = fnws(wsData.gameplay.hits['50'])
		// 	  document.getElementById('gameplayStat_miss').innerText = fnws(wsData.gameplay.hits['0'])
		// 	  document.getElementById('gameplayStat_sb').innerText = fnws(wsData.gameplay.hits.sliderBreaks)
		// 	  document.getElementById('gameplayStat_score').innerText = fnws(wsData.gameplay.score)
		// 	  document.getElementById('gameplayStat_rank').innerText = wsData.gameplay.hits.grade.current
		// 	  document.getElementById('gameplayStat_acc').innerText = `${wsData.gameplay.accuracy} %`
		// 	  document.getElementById('gameplayStat_combo').innerText = fnws(wsData.gameplay.combo.current)
		// 	  document.getElementById('gameplayStat_mcombo').innerText = fnws(wsData.gameplay.combo.max)

		// if (parseInt(missChecker.Miss) !== parseInt((wsData.gameplay.hits['0'] + wsData.gameplay.hits.sliderBreaks))) {
		// 	missChecker.Miss = wsData.gameplay.hits['0'] + wsData.gameplay.hits.sliderBreaks
		// 	missChecker.checked = false
		// }

		// if (parseInt(missChecker.Miss) !== parseInt((wsData.gameplay.hits['0'] + wsData.gameplay.hits.sliderBreaks))) {
		// 	missChecker.Miss = wsData.gameplay.hits['0'] + wsData.gameplay.hits.sliderBreaks
		// 	missChecker.checked = false
		// }

		// if (!missChecker.checked) {
		// 	missChecker.checked = true
		// 	//   const keyPressed = document.querySelectorAll('.pressed');
		// 	//   keyPressed.forEach(function(element) {
		// 	// 	//   element.classList.add('missed')
		// 	// 	  setTimeout(
		// 	// 		  () => { 
		// 	// 			// element.classList.remove('missed')

		// 	// 		  },
		// 	// 		  100);
		// 	//   });
		// }

		// if (parseInt(sbChecker.Miss) !== parseInt((wsData.gameplay.hits.sliderBreaks))) {
		// 	sbChecker.Miss = wsData.gameplay.hits['0'] + wsData.gameplay.hits.sliderBreaks
		// 	sbChecker.checked = false
		// }

		// if (!sbChecker.checked) {
		// 	sbChecker.checked = true
		// 	// playVoice('FR', 'aim')
		// }
		// let lastHit = []
		// const gameplay = wsData.gameplay
		// if (gameplay.hits.hitErrorArray) {
		// 	hitErrorArrayTab = gameplay.hits.hitErrorArray.slice(-200);
		// 	lastHit = gameplay.hits.hitErrorArray.slice(-1);
		// }

		// //   const key1 = document.getElementById('keyPressed1')
		// //   const key2 = document.getElementById('keyPressed2')

		// //   document.getElementById('urStat').innerText = `UR: ${parseInt(gameplay.hits.unstableRate)}`
		// if (gameplay.keyOverlay.k1.isPressed) {
		// 	//   key1.classList.add('pressed')
		// 	console.log('k1 pressed')
		// 	key1ArrayHits.push([lastHit, gameplay.hits.unstableRate]);
		// }
		// else {

		// 	//   key1.classList.remove('pressed')
		// }
		// if (gameplay.keyOverlay.k2.isPressed) {
		// 	//   key2.classList.add('pressed')
		// 	console.log('k2 pressed')

		// 	key2ArrayHits.push([lastHit, gameplay.hits.unstableRate]);

		// } else {
		// 	//   key2.classList.remove('pressed')


		// }

		//   await rankHitErrors(hitErrorArrayTab)
		//   const k1 = calcAVGk1()
		//   const k2 = calcAVGk2()

		//   document.getElementById('k1avg').innerText = `UR ~ ${parseInt(k1.avgUnstableRate)}`
		//   document.getElementById('k2avg').innerText = `UR ~ ${parseInt(k2.avgUnstableRate)}`
		//   document.getElementById('k1avg2').innerText = `~ ${(k1.avgLastHit).toFixed(2)} ms`
		//   document.getElementById('k2avg2').innerText = `~ ${(k2.avgLastHit).toFixed(2)} ms`

		//   if (k2.avgLastHit <= -5 || k2.avgLastHit >= 5) {
		// 	  document.getElementById('k2avg2').classList.remove('ok')
		// 	  document.getElementById('k2avg2').classList.add('err')
		//   }
		//   else {
		// 	  document.getElementById('k2avg2').classList.remove('err')
		// 	  document.getElementById('k2avg2').classList.add('ok')
		//   }
		//   if (k1.avgLastHit <= -5 || k1.avgLastHit >= 5) {
		// 	  document.getElementById('k1avg2').classList.remove('ok')
		// 	  document.getElementById('k1avg2').classList.add('err')
		//   } else {
		// 	  document.getElementById('k1avg2').classList.remove('err')
		// 	  document.getElementById('k1avg2').classList.add('ok')
		//   }

		//   function calcAVGk2() {
		// 	  let sumLastHit = 0;
		// 	  let sumUnstableRate = 0;
		// 	  let validCount = 0;
		// 	  for (let i = 0; i < key2ArrayHits.length; i++) {
		// 		  const subArray = key2ArrayHits[i];
		// 		  const lastHitValue = parseFloat(subArray[0]);
		// 		  if (!isNaN(lastHitValue)) {
		// 			  sumLastHit += lastHitValue;
		// 			  sumUnstableRate += subArray[1];
		// 			  validCount++;
		// 		  }
		// 	  }
		// 	  const avgLastHit = validCount > 0 ? sumLastHit / validCount : 0;
		// 	  const avgUnstableRate = validCount > 0 ? sumUnstableRate / validCount : 0;
		// 	  return { avgLastHit, avgUnstableRate };
		//   }
		//   function calcAVGk1() {
		// 	  let sumLastHit = 0;
		// 	  let sumUnstableRate = 0;
		// 	  let validCount = 0;
		// 	  for (let i = 0; i < key1ArrayHits.length; i++) {
		// 		  const subArray = key1ArrayHits[i];
		// 		  const lastHitValue = parseFloat(subArray[0]);
		// 		  if (!isNaN(lastHitValue)) {
		// 			  sumLastHit += lastHitValue;
		// 			  sumUnstableRate += subArray[1];
		// 			  validCount++;
		// 		  }
		// 	  }
		// 	  const avgLastHit = validCount > 0 ? sumLastHit / validCount : 0;
		// 	  const avgUnstableRate = validCount > 0 ? sumUnstableRate / validCount : 0;
		// 	  return { avgLastHit, avgUnstableRate };
		//   }
	}, pollrateGameplay);
}, 2000);

//   ipcRenderer.on('endPlaying', (event, result) => {})
//   ipcRenderer.on('leftPlaying', (event) => {})


//   async function rankHistoryUpdate(data) {
// 	  function generateDateLabels(numDays) {
// 		  const labels = [];
// 		  for (let i = numDays; i >= 1; i--) {
// 			  labels.push(`${i} day${i > 1 ? 's' : ''} ago`);
// 		  }
// 		  return labels;
// 	  }

// 	  // Nombre de jours
// 	  const numDays = 90;
// 	  const chartOptions = {
// 		  chart : {
// 			  type : 'line',
// 			  events : {
// 				  load : function() {
// 					  this.container.oncontextmenu = function(e) {
// 						  e.preventDefault();
// 					  };
// 					  const backgroundElement = document.querySelector('.highcharts-background');
// 					  if (backgroundElement) {
// 						  backgroundElement.style.fill = 'none';
// 					  };
// 				  },
// 			  },
// 		  },
// 		  backgroundColor : null,
// 		  title : {
// 			  text : null,
// 		  },
// 		  legend : {
// 			  enabled : false,
// 		  },
// 		  credits : {
// 			  enabled : false,
// 		  },
// 		  exporting : {
// 			  buttons : {
// 				  contextButton : {
// 					  enabled : false,
// 				  },
// 			  },
// 		  },
// 		  xAxis : {
// 			  visible : false,
// 			  categories : generateDateLabels(numDays),
// 			  color : '#a84a89'
// 		  },
// 		  yAxis : {
// 			  visible : false,
// 			  reversed : true,
// 			  categories : generateDateLabels(numDays),
// 			  color : '#a84a89'
// 		  },
// 		  series : [
// 			  {
// 				  name : 'Rank',
// 				  data : data,
// 				  color : '#a84a89',
// 				  animation : false,
// 			  },

// 		  ],
// 	  };
// 	  Highcharts.chart('rank_highligh', chartOptions);
//   }
//   async function rankHitErrors(data) {
// 	  function generatePositionLabels(numItems) {
// 		  const labels = [];
// 		  for (let i = 1; i <= numItems; i++) {
// 			  labels.push('');
// 		  }
// 		  return labels;
// 	  }
// 	  const numItems = 200;
// 	  const horizontalBarValue = 0;

// 	  const chartOptions = {
// 		  chart : {
// 			  type : 'line',
// 			  events : {
// 				  load : function() {
// 					  this.container.oncontextmenu = function(e) {
// 						  e.preventDefault();
// 					  };
// 					  const backgroundElements = document.querySelectorAll('.highcharts-background');

// 					  backgroundElements.forEach(function(element) {
// 						  element.style.fill = 'none';
// 					  });
// 				  },
// 			  },
// 		  },
// 		  backgroundColor : null,
// 		  title : {
// 			  text : null,
// 		  },
// 		  legend : {
// 			  enabled : false,
// 		  },
// 		  credits : {
// 			  enabled : false,
// 		  },
// 		  exporting : {
// 			  buttons : {
// 				  contextButton : {
// 					  enabled : false,
// 				  },
// 			  },
// 		  },
// 		  xAxis : {
// 			  visible : false,
// 			  categories : generatePositionLabels(numItems),
// 			  color : '#a84a89',
// 		  },
// 		  yAxis : {
// 			  visible : false,
// 			  min : -100,
// 			  max : 100,
// 			  color : '#a84a89',
// 		  },
// 		  series : [
// 			  {
// 				  name : 'Hit Error',
// 				  data : data,
// 				  color : '#a84a89',
// 				  marker : {
// 					  enabled : false,
// 				  },
// 				  animation : false,
// 			  },
// 			  {
// 				  type : 'line',
// 				  name : 'Horizontal Bar',
// 				  data : Array(numItems).fill(horizontalBarValue),
// 				  color : 'rgb(243, 176, 191)',
// 				  lineWidth : 2,
// 				  marker : {
// 					  enabled : false,
// 				  },
// 				  animation : false,

// 			  },
// 		  ],
// 	  };

// 	  Highcharts.chart('HitArrErr_highligh', chartOptions);
//   }
//   function fnws(number) {
// 	  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
//   }






function ctm(ms, totms) {
	const totalSeconds = Math.floor(totms / 1000);
	const totalMinutes = Math.floor(totalSeconds / 60);
	const totalHours = Math.floor(totalMinutes / 60);

	const currentSeconds = Math.floor(ms / 1000);
	const currentMinutes = Math.floor(currentSeconds / 60);
	const currentHours = Math.floor(currentMinutes / 60);

	const remainingSeconds = currentSeconds % 60;
	const remainingMinutes = currentMinutes % 60;

	const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
	const formattedMinutes = remainingMinutes.toString().padStart(2, '0');
	const formattedHours = totalHours > 0 ? currentHours.toString().padStart(2, '0') : '';

	if (totalHours > 0) {
		return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
	} else {
		return `${formattedMinutes}:${formattedSeconds}`;
	}
}
