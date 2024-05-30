var sortOrders = require('../common/arrays/array_sort_order')
var bindKeys = require('../common/arrays/array_key_binds')
const { ctm } = require('../front/utils/ctm')
const { calcHeight } = require('../front/utils/calcHeight')
const { Link } = require('../front/utils/Link')
const ReconnectingWebSocket = require('../server/gosumemory_handler');
const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);
const { ipcRenderer } = require('electron');
const moment = require('moment');
require('moment-timezone');

let currentIndex = 0;
let currentBeatmapId = null;

var ts = 0
var wsData = null
var basic_infos
var gameplay

var toggles = {
	left_menuToggle: true,
	settings_page: "settings_general",
	global_page: "home_page",
	Gamemode: "STD",
	cursorTrace: false,
	spectactePlay: false,
}
var phPStats = {
	countryRank: document.getElementById('stat_CountryRank'),
	globalRank: document.getElementById('stat_GlobalRank'),
	classedScore: document.getElementById('stat_ClassedScore'),
	accuracy: document.getElementById('stat_Accuracy'),
	playCount: document.getElementById('stat_PlayCount'),
	totalScore: document.getElementById('stat_TotalScore'),
	clicks: document.getElementById('stat_Clicks'),
	masterSkillset: document.getElementById('stat_MasterSkillset'),
	maxCombo: document.getElementById('stat_ComboMax'),
	AIM: document.getElementById('stat_AIM'),
	graph: document.getElementById('stat_Graph'),
	refresh_dt: document.getElementById('stats_refresh_dt'),
	username: document.getElementById('playerInfo_Username'),
	gamePreference: document.getElementById('playerInfo_GamePreference'),
	avatarUrl: document.getElementById('playerInfo_AvatarUrl'),
	isSupporter: document.getElementById('playerInfo_isSupporter')
}

let software_info = document.getElementById('software_info')

let translations = {};
let newTranslations = {};

let shareBtn = document.getElementById('shareBtn')
let openBtn = document.getElementById('OpenBtn')

const bg = document.getElementById('root');
const windowWidth = window.innerWidth / 5;
const windowHeight = window.innerHeight / 5;
let CollectionList
var bm_stats_holders = {
	hp: document.getElementById('bm_stats_hp'),
	od: document.getElementById('bm_stats_od'),
	cs: document.getElementById('bm_stats_cs'),
	sr: document.getElementById('bm_stats_sr'),
	ar: document.getElementById('bm_stats_ar'),
	kc: document.getElementById('bm_stats_kc'),
	fc95: document.getElementById('bm_stats_fc95'),
	fc98: document.getElementById('bm_stats_fc98'),
	fc100: document.getElementById('bm_stats_fc100'),
	difficulty: document.getElementById('bm_stats_difficulty'),
	bpm: document.getElementById('bm_stats_bpm'),
	mapStatus: document.getElementById('bm_stats_status'),
}
var playerEvents = {
	draggeable: false,
	draggedItem: null,
	originalParent: null,
	originalEvent: null,
	originalInfo: null,
	dragTimeout: null,
	timeout: null,
	allowAddClass: null
}
var previousValues = {
	"0": 0,
	"50": 0,
	"100": 0,
	"300": 0,
	"geki": 0,
	"katu": 0,
	"sliderBreaks": 0,
}
var miniPlayerEl = {
	miniPlayer: document.getElementById('player-spectacle-min'),
	overlay: document.getElementById('overlayMiniPlayer'),
	playerMain: document.getElementById('myVideo'),
	playerAux: document.getElementById('player2'),
	toolbarEmbed: document.getElementById('toolbarEmbed'),
	allBtns: document.querySelectorAll('.btn-player')
}
var miniPlayerPos = {
	startX: 0,
	startY: 0,
	startWidth: 0,
	startHeight: 0,
	aspectRatio: 0,
	rafId: null
}
const resizingHandles = {
	ovr1: document.getElementById('ovr1'),
	ovr2: document.getElementById('ovr2'),
	ovr3: document.getElementById('ovr3'),
	ovr4: document.getElementById('ovr4')
}
miniPlayerEl.overlay.onmousedown = function (event) {
	event.preventDefault();
	miniPlayerPos.startX = event.clientX - miniPlayerEl.miniPlayer.getBoundingClientRect().left;
	miniPlayerPos.startY = event.clientY - miniPlayerEl.miniPlayer.getBoundingClientRect().top;
	document.addEventListener('mousemove', onMouseMovePlayer);
	document.addEventListener('mouseup', stopDragPlayer);
}
function onMouseMovePlayer(event) {
	let newX = event.clientX - miniPlayerPos.startX;
	let newY = event.clientY - miniPlayerPos.startY;

	const divWidth = miniPlayerEl.miniPlayer.offsetWidth;
	const divHeight = miniPlayerEl.miniPlayer.offsetHeight;


	const maxX = 1392 - divWidth;
	const maxY = 692 - divHeight;

	newX = Math.max(18, Math.min(newX, maxX));
	newY = Math.max(18, Math.min(newY, maxY));

	miniPlayerEl.miniPlayer.style.left = newX + 'px';
	miniPlayerEl.miniPlayer.style.top = newY + 'px';
}
function stopDragPlayer() {
	document.removeEventListener('mousemove', onMouseMovePlayer);
	document.removeEventListener('mouseup', stopDragPlayer);
}
document.querySelectorAll('.overlayResizing').forEach(handle => {
	handle.addEventListener('mousedown', function (event) {
		event.preventDefault();
		miniPlayerPos.startX = event.clientX;
		miniPlayerPos.startY = event.clientY;
		miniPlayerPos.startWidth = parseInt(window.getComputedStyle(miniPlayerEl.miniPlayer).width, 10);
		miniPlayerPos.startHeight = parseInt(window.getComputedStyle(miniPlayerEl.miniPlayer).height, 10);
		miniPlayerPos.aspectRatio = miniPlayerPos.startWidth / miniPlayerPos.startHeight;

		document.addEventListener('mousemove', startResize);
		document.addEventListener('mouseup', stopResize);
	});
})
function startResize(event) {
	window.cancelAnimationFrame(miniPlayerPos.aspectRatio);
	miniPlayerPos.aspectRatio = window.requestAnimationFrame(function () {
		resize(event);
	});
}
function resize(event) {
	const deltaX = event.clientX - miniPlayerPos.startX;
	const deltaY = event.clientY - miniPlayerPos.startY;
	let newWidth, newHeight;

	newWidth = miniPlayerPos.startWidth + deltaX;
	newHeight = newWidth / miniPlayerPos.aspectRatio;

	if (newWidth >= 100 && newWidth <= 1392 && newHeight >= 50 && newHeight <= 692) {
		miniPlayerEl.miniPlayer.style.width = `${newWidth}px`;
		miniPlayerEl.miniPlayer.style.height = `${newHeight}px`;
	}
}
function stopResize() {
	document.removeEventListener('mousemove', startResize);
	document.removeEventListener('mouseup', stopResize);
	window.cancelAnimationFrame(miniPlayerPos.aspectRatio);
	updateHandles();
}
function updateHandles() {
	const bounds = miniPlayerEl.miniPlayer.getBoundingClientRect();
	resizingHandles.ovr1.classList.toggle('allow', bounds.right + 8 <= 1392 && bounds.top - 8 >= 18);
	resizingHandles.ovr2.classList.toggle('allow', bounds.right + 8 <= 1392 && bounds.bottom + 8 <= 692);
	resizingHandles.ovr3.classList.toggle('allow', bounds.left - 8 >= 18 && bounds.top - 8 >= 18);
	resizingHandles.ovr4.classList.toggle('allow', bounds.left - 8 >= 18 && bounds.bottom + 8 <= 692);
}
function playerEvent(e) {
	var event = e.currentTarget.getAttribute('event');
	var currentTime = miniPlayerEl.playerMain.currentTime;

	switch (event) {
		case 'forward':
			if (miniPlayerEl.playerMain.currentTime + 5 < miniPlayerEl.playerMain.duration) {
				miniPlayerEl.playerMain.currentTime += 5;
			} else {
				miniPlayerEl.playerMain.currentTime = miniPlayerEl.playerMain.duration;
			}
			break;
		case 'cursor-trail':

			if (!toggles.cursorTrace) {
				miniPlayerEl.playerMain.src = "../src/withTrace.mp4";
				toggles.cursorTrace = true
				e.target.classList.remove('white')
				e.target.classList.add('soft-green')


			} else {
				miniPlayerEl.playerMain.src = "../src/noTrace.mp4";
				toggles.cursorTrace = false
				e.target.classList.remove('soft-green')
				e.target.classList.add('white')

			}
			miniPlayerEl.playerMain.addEventListener('loadedmetadata', function () {
				miniPlayerEl.playerMain.currentTime = currentTime;

				miniPlayerEl.playerMain.play();

			}, { once: true });

			break;
		case 'settings':

			break;
		case 'detach-screen':
			miniPlayerEl.miniPlayer.classList.add('show')
			var isPlaying = !miniPlayerEl.playerMain.paused;

			miniPlayerEl.playerAux.src = "../src/noTrace.mp4";
			miniPlayerEl.playerAux.load();

			miniPlayerEl.playerAux.addEventListener('loadedmetadata', function () {
				miniPlayerEl.playerAux.currentTime = currentTime;
				if (isPlaying) {
					miniPlayerEl.playerAux.play();
				} else {
					miniPlayerEl.playerAux.pause();
				}
			}, { once: true });

			miniPlayerEl.playerMain.src = '';
			break;
		case 'full-screen':

			break;
		case 'play':

			if (!toggles.spectactePlay) {
				miniPlayerEl.playerMain.play();

				e.target.classList.remove('play-circle')
				e.target.classList.add('pause-circle')
				toggles.spectactePlay = true

			} else {
				miniPlayerEl.playerMain.pause()

				e.target.classList.add('play-circle')
				e.target.classList.remove('pause-circle')
				toggles.spectactePlay = false
			}

			break;
		case 'pause':

			break;
		case 'rewind':
			if (miniPlayerEl.playerMain.currentTime - 5 > 0) {
				miniPlayerEl.playerMain.currentTime -= 5;
			} else {
				miniPlayerEl.playerMain.currentTime = 0;
			}
			break;

		default:
			break;
	}
}
miniPlayerEl.allBtns.forEach(btn => {
	btn.addEventListener('mousedown', function (e) {
		if (this.querySelector('m')) {
			playerEvents.originalParent = this;
			playerEvents.originalEvent = this.getAttribute('event');
			playerEvents.originalInfo = this.getAttribute('data-info')
			playerEvents.dragTimeout = setTimeout(() => {
				startDrag(this, e);

			}, 1000);
		}
	});
	document.addEventListener('mouseup', () => {
		if (playerEvents.dragTimeout) {
			clearTimeout(playerEvents.dragTimeout);
			playerEvents.dragTimeout = null;
		}
	});
})
function startDrag(element, e) {
	if (!playerEvents.dragTimeout) return;
	playerEvents.draggeable = true
	playerEvents.draggedItem = element.querySelector('m').cloneNode(true);
	playerEvents.draggedItem.style.cursor = "grabbing"
	playerEvents.draggedItem.style.position = 'absolute';
	playerEvents.draggedItem.style.zIndex = '1000';
	document.body.appendChild(playerEvents.draggedItem);
	updateDraggedItemPosition(e);
	element.setAttribute('event', 'null');
	element.innerHTML = '•';
	document.querySelectorAll('.btn-player[event="null"]').forEach(btn => {
		btn.classList.add('prepare-to-drag');
	});
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', stopDrag);
}
function onMouseMove(e) {
	if (playerEvents.draggedItem) {
		updateDraggedItemPosition(e);
	}
}
function updateDraggedItemPosition(e) {
	playerEvents.draggedItem.style.left = e.pageX - playerEvents.draggedItem.offsetWidth / 2 + 'px';
	playerEvents.draggedItem.style.top = e.pageY - playerEvents.draggedItem.offsetHeight / 2 + 'px';
}
function stopDrag(e) {
	if (playerEvents.draggedItem) {
		document.removeEventListener('mousemove', onMouseMove);
		document.body.removeChild(playerEvents.draggedItem);
		let dropTarget = document.elementFromPoint(e.clientX, e.clientY).closest('.btn-player');
		if (dropTarget && miniPlayerEl.toolbarEmbed.contains(dropTarget) && !dropTarget.querySelector('m') && dropTarget.getAttribute('event') === 'null') {
			dropTarget.innerHTML = '';
			dropTarget.appendChild(playerEvents.draggedItem);
			dropTarget.setAttribute('event', playerEvents.originalEvent);
			dropTarget.setAttribute('data-info', playerEvents.originalInfo);

		} else {
			oplayerEvents.riginalParent.innerHTML = '';
			playerEvents.originalParent.appendChild(playerEvents.draggedItem);
			playerEvents.originalParent.setAttribute('data-info', playerEvents.originalInfo);
		}
		playerEvents.draggedItem.style = "", playerEvents.draggedItem.style.cursor = ""
		playerEvents.draggedItem = null, playerEvents.originalParent = null, playerEvents.originalEvent = null;

	}
	document.querySelectorAll('.btn-player.prepare-to-drag').forEach(btn => {
		btn.classList.remove('prepare-to-drag');
	});
	playerEvents.draggeable = false
	document.removeEventListener('mouseup', stopDrag);
}
const callToActionsEmbed = document.getElementById('callToActionsEmbed');
const callToActions = document.getElementById('callToActions');
function player_toolbar_handleMouseOver() {
	if (playerEvents.allowAddClass) {
		callToActions.classList.add('show');
		resetTimer();
	}
}
function player_toolbar_handleMouseMove() {
	if (!playerEvents.allowAddClass) {
		callToActions.classList.add('show');
		resetTimer();
	}
}
function resetTimer() {
	if (!playerEvents.draggeable) {
		clearTimeout(playerEvents.timeout);
		playerEvents.timeout = setTimeout(() => {
			callToActions.classList.remove('show');
			playerEvents.allowAddClass = false;
		}, 8000);
	}
}
function player_toolbar_handleMouseLeave() {
	if (!playerEvents.draggeable) {
		clearTimeout(playerEvents.timeout);
		callToActions.classList.remove('show');
		playerEvents.allowAddClass = true;
	}
}
callToActionsEmbed.addEventListener('mouseover', player_toolbar_handleMouseOver);
callToActionsEmbed.addEventListener('mouseleave', player_toolbar_handleMouseLeave);
callToActionsEmbed.addEventListener('mousemove', player_toolbar_handleMouseMove)

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
};
document.querySelector('.sorted-by').addEventListener('click', sortScoreList);

let action_RefreshDataScores = document.getElementById('action_RefreshDataScores')
let left_menu = document.getElementById('side_left_menu');
let content = document.getElementById('main-content')
let boxInfo = document.querySelector('.over-info');
let scores = document.querySelectorAll('.toprank-element')
let notificationBox = document.getElementById('notification-box')

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
function switchMode(mode) {
	document.querySelectorAll('.modeswtichBtn').forEach(function (element) {
		element.classList.remove('active')
		document.getElementById(`modeBtn${mode}`).classList.add('active')

		phPStats.countryRank.innerText = ''
		phPStats.globalRank.innerText = ''
		phPStats.classedScore.innerText = ''
		phPStats.accuracy.innerText = ''
		phPStats.playCount.innerText = ''
		phPStats.totalScore.innerText = ''
		phPStats.clicks.innerText = ''
		phPStats.masterSkillset.innerText = ''
		phPStats.AIM.innerText = ''
		phPStats.maxCombo.innerText = ''
		// phPStats.graph = null
	})
}
document.querySelectorAll('.btn').forEach(function (btn) {
	btn.addEventListener('click', function () {
		let siblings
		if(btn.closest('.setting-element') && querySelectorAll('.btn')){
			siblings = btn.closest('.setting-element').querySelectorAll('.btn');
		} else {
			siblings = null
		}
	
			
			btn.classList.add('active');

			let value = btn.getAttribute('data-option')
			let event = btn.getAttribute('data-event')
			switch (event) {
				case 'setLanguage':
					ipcRenderer.send('getLang', value)
					ipcRenderer.on('lang', (lg, dictionnary) => {
						newTranslations = JSON.parse(dictionnary)
						updateTranslations()
					})
					break;
				case 'setMinimizeWindow':
					break;
				case 'setTheme':
					break;
				case 'setDisplayNumber':
					document.querySelectorAll('.number').forEach(function (element) {
						let number = parseFloat(element.getAttribute('data-value').replace(/\s/g, ''));

						let formattedNumber = '';

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

								formattedNumber = number.toString();
						}

						element.innerText = formattedNumber
					});


					break;
				case 'setSubmitScore':
					break;
				case 'setAutoUpdate':
					break;
				case 'setOsuFolderStable':
					ipcRenderer.send('open-directory-dialog', 'folderPathStable');
					break;
				case 'setOsuFolderLazer':
					ipcRenderer.send('open-directory-dialog', 'folderPathLazer');
					break;
				case 'setDownloadMapsCollection':
					break;
				case 'setDownloadMapsSpectacle':
					break;
				case 'logout':

					break;
				case 'setScanosuFiles':
					break;
				case 'setMusicSync':
					break;
				case "openBrowser":
					Link('openBrowser', `https://shop.bellafiora.fr/credits/`)
					break;
				case 'Reset':
					break;
					default:
					break;
			}
		
	});
})
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
document.getElementById("settings_menu").addEventListener("click", function (event) {
	if (event.target.classList.contains("navigate-page")) {
		if (!event.target.classList.contains('active')) {
			let target = event.target.getAttribute('target')

			let oldToggle = toggles.settings_page
			toggles.settings_page = target
			setTimeout(() => {
				document.querySelector(`div[target=${oldToggle}]`).classList.remove('active')
				document.getElementById(oldToggle).classList.remove('active')
				document.getElementById(target).classList.add('active')
				event.target.classList.add('active')
			}, 50);
		}
	}
})
document.querySelectorAll('.menuBtn').forEach(function (element) {
	element.addEventListener('click', function (event) {
		if (element.getAttribute('disabled')) {
			showNotificationBox(tr('This page is not available'), 'warning')
			return
		}
		if (!element.classList.contains('active')) {

			let target = element.getAttribute('target')
			let oldToggle = toggles.global_page
			toggles.global_page = target
			setTimeout(() => {
				if (toggles.global_page === "gameplay_page") {
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

})
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
function showCollectionContextMenu(element) {
	document.querySelector('.context-menu').classList.add('show')
	document.querySelector('.context-menu').innerHTML = ''
	function createBtn(label, action, collectionName) {

		let div = document.createElement('div')
		div.classList.add('button-context')
		div.textContent = label
		div.onclick = function () {
			switch (action) {
				case 'cancel':
					div.onclick = function () {
						document.querySelector('.context-menu').classList.remove('show')
						document.querySelector('.context-menu').innerHTML = ""
					}
					break;
				case 'export-osudb':

					break;
				case 'export-clbf': 
					ipcRenderer.invoke('select-output-directory').then(outputDirectory => {
						ipcRenderer.send('export-clbf', outputDirectory, element.getAttribute('name'))
						document.querySelector('.context-menu').classList.remove('show')
						document.querySelector('.context-menu').innerHTML = ""
						document.getElementById(`collection-${collectionName}`).classList.add('show')
					})

					
					break;
				case 'exports-all': {

					break;
				}
			
				default:
					break;
			}
		}
		

		document.querySelector('.context-menu').appendChild(div)
	}

	createBtn('Export to collection.db', 'export-osudb', element.getAttribute('name'))
	createBtn('Export to collection.clbf', 'export-clbf', element.getAttribute('name'))
	createBtn('Filters beatmaps', 'filters', element.getAttribute('name'))
	createBtn('Exports all beatmaps to .zip', 'exports-all', element.getAttribute('name'))
	createBtn('Cancel', 'cancel', null)

}
scores.forEach(function (element) {
	element.addEventListener('click', function () {
		showScoreContextMenu(element);
	});
})
function handleMouseOver(event, element) {
	boxInfo.innerHTML = element.getAttribute('data-info')
	updateBoxInfoPosition(event.clientX, event.clientY, calcHeight(element.getAttribute('data-info')));
	boxInfo.classList.add('show')



	element.addEventListener('mousemove', function (event) {
		handleMouseMove(event, calcHeight(element.getAttribute('data-info')));
	});

}
function handleMouseMove(event, height) { updateBoxInfoPosition(event.clientX, event.clientY, height); }
function handleMouseOut() {
	boxInfo.classList.remove('show')
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
})
function handleMouseOut(event) { boxInfo.classList.remove('show'); }

var pollrateGameplay = 250
global.pluginInterface = { getWindow: () => window }


function setInputKey(keyNumber) {
	document.getElementById(`keySelect`).innerText = document.getElementById(`key${keyNumber}`).innerHTML

	document.getElementById('changeKeyBind').classList.add('show');
	let key = document.getElementById(`key${keyNumber}`).innerHTML;

	function handleKeyDown(event) {


		if (event.key === "Enter") {

			document.getElementById('changeKeyBind').classList.remove('show');
			document.getElementById(`key${keyNumber}`).innerText = key;
			document.removeEventListener('keydown', handleKeyDown);

		} else {


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
async function IntroduceDataPlayer(data) {
	var defaultMod = false

	if (!defaultMod) {
		defaultMod = (data.default_mode === 'osu') ? 0 : (data.default_mode  === 'mania') ? 3 : (data.default_mode  === 'fruits') ? 2 : (data.default_mode  === 'taiko') ? 1 : '?';
	}
	else {
		defaultMod = (defaultMod === 'osu') ? 0 : (defaultMod === 'mania') ? 3 : (defaultMod === 'fruits') ? 2 : (defaultMod === 'taiko') ? 1 : '?';
	}

	// defaultMod === 'fruits' ? defaultMod = 'ctb' : defaultMod
	let rank_history = JSON.parse(data.games[data.default_mode].rank_history)
	let globalRank = rank_history[rank_history.length - 1];


	console.log(data.games[`${data.default_mode}`])
	document.getElementById('stats_refresh_dt').innerText = data.last_update
	document.getElementById('playerInfo_AvatarUrl').src = data.avatar_url
	document.getElementById('username').innerText = data.username
	document.getElementById('stat_CountryRank').innerText = data.games[data.default_mode].country_rank
	document.getElementById('stat_GlobalRank').innerText = globalRank
	document.getElementById('stat_pp').innerText = parseInt(data.games[data.default_mode].statistics.pp)
	document.getElementById('stat_ClassedScore').innerText = 0;
	document.getElementById('stat_TotalScore').innerText = data.games[data.default_mode].statistics.scores.total
	document.getElementById('stat_Accuracy').innerText = `${(parseFloat(data.games[data.default_mode].statistics.accuracy)).toFixed(2)} %`;
	// document.getElementById('stat_Clicks').innerText = 0;
	document.getElementById('stat_ComboMax').innerText = data.games[data.default_mode].statistics.max_combo
	document.getElementById('stat_PlayCount').innerText = 0
	// document.getElementById('userStat_nb_ssh').innerText = data.games[data.default_mode].statistics.notes.ssh
	// document.getElementById('userStat_nb_ss').innerText = data.games[data.default_mode].statistics.notes.ss
	// document.getElementById('userStat_nb_sh').innerText = data.games[data.default_mode].statistics.notes.sh
	// document.getElementById('userStat_nb_s').innerText = data.games[data.default_mode].statistics.notes.s
	// document.getElementById('userStat_nb_a').innerText = data.games[data.default_mode].statistics.notes.a
	// rankHistoryUpdate(gameplay['m' + defaultMod].history_rank)
}

let tosuWebSocket = new ReconnectingWebSocket('ws://127.0.0.1:24050/ws');
let tosuWebSocketKeys = new ReconnectingWebSocket('ws://127.0.0.1:24050/websocket/v2/precise');

tosuWebSocket.onclose = () => { tosuWebSocket.send('Client Closed!'); };
tosuWebSocketKeys.onclose = () => { tosuWebSocket.send('Client Closed!'); };
tosuWebSocket.onerror = error => console.log('Socket Error: ', error);
tosuWebSocketKeys.onerror = error => console.log('Socket Error: ', error);

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
}
function setTranslations(newDictionnary = null) {
	document.querySelectorAll('trs').forEach(elem => {
		const key = elem.innerHTML
		if (newDictionnary) {
			elem.innerHTML = tr(key, newDictionnary);
		} else {
			elem.innerHTML = tr(key);
		}
	});
}
function setTranslations() {
	document.querySelectorAll('trs').forEach(elem => {
		const key = elem.innerHTML
		elem.innerHTML = tr(key);
	});
}
function updateTranslations() {
	document.querySelectorAll('trs').forEach(elem => {
		const key = elem.getAttribute('key')
		elem.innerHTML = tr(key, true);
	});
}
function tr(key, ifUpdate) {
	return ifUpdate ? newTranslations[key] || key : translations[key] || key
	// return translations[key] || "<err>"+key+"</err>"
}
function createCollectionsHandler(collectionsList) {

	let nbMaps = 0


	Object.keys(collectionsList).forEach(collectionName => {

		let CollectionList = document.getElementById('lcollection')

		let collectionElement = document.createElement('div');
		collectionElement.classList.add('collection-name');
		collectionElement.setAttribute('name', collectionName)
		collectionElement.classList.add('added')
		let holder = document.createElement('div')
		holder.classList.add('holder')
		holder.innerText = "Exportation.."
		holder.setAttribute('id',`collection-${collectionName}`)
		let span = document.createElement('span');
		let input = document.createElement('input');
		input.setAttribute('disabled', 'disabled')
		input.setAttribute('type', 'text');
		input.setAttribute('value', `${collectionName}`);
		input.setAttribute('defaultValue',collectionName)
	
		// (${collectionsList[collectionName].length})
		span.appendChild(input);

		let m1 = document.createElement('m');
		let m2 = document.createElement('m');
		let m3 = document.createElement('m')

		m1.classList.add('pencil-square');
		m1.classList.add('glass-grey');
		m2.classList.add('folder-minus');
		m2.classList.add('soft-red');
		m3.classList.add('ellipsis-horizontal-circle');
		m3.classList.add('glass-grey');

		m1.setAttribute('data-event', 'Edit name');
		m2.setAttribute('data-event', 'Delete');
		m1.setAttribute('data-info', 'Edit name');
		m2.setAttribute('data-info', 'Delete');
		m3.setAttribute('data-info', 'More options');
		m3.setAttribute('data-event', 'more');

		collectionElement.appendChild(span)
		collectionElement.appendChild(m1)
		collectionElement.appendChild(m2)
		collectionElement.appendChild(m3)
		collectionElement.appendChild(holder)

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
			
			if(input.getAttribute('defaultvalue') !== input.value){
				
				input.setAttribute('defaultValue', input.value)
				if (oldKey in collectionsList) {
					data[newKey] = data[oldKey];
					
					delete data[oldKey];
				  }

			}

			m2.setAttribute('data-event', 'Delete');
			m2.setAttribute('data-info', 'Delete');
			m1.setAttribute('data-event', 'Edit name');
			m1.setAttribute('data-info', 'Edit name');

			m1.classList.add('pencil-square');
			m1.classList.add('glass-grey');
			m2.classList.add('folder-minus');
			

			m1.classList.remove('check');
			m1.classList.remove('soft-green');
			m2.classList.remove('arrow-uturn-left');
		
			
			
			input.disabled = true
			//Write Collection in collection.db
		}

		document.addEventListener('keydown', function (event) {
			if(m1.getAttribute('data-event') === "Save"){
				if (event.key === 'Enter') {
					console.log('save')
					SaveNewCollection()
					// document.removeEventListener('keydown');
				}
			}
			
		})

		m1.addEventListener('click', function () {
			if(m1.getAttribute('data-event') === "Edit name"){

				m1.classList.remove('pencil-square');
				m1.classList.remove('glass-grey');
				m2.classList.remove('folder-minus');
				m2.classList.remove('soft-red');

				m1.classList.add('check');
				m1.classList.add('soft-green');
				m2.classList.add('arrow-uturn-left');
				m2.classList.add('soft-red');

				m1.setAttribute('data-event', 'Save');
				m2.setAttribute('data-event', 'Cancel');
				m1.setAttribute('data-info', 'Save');
				m2.setAttribute('data-info', 'Cancel');

				input.removeAttribute('disabled')
			} else {
				console.log('save')
				SaveNewCollection()
			}
			
		});

		m2.addEventListener('click', function (event) {
			if(m1.getAttribute('data-event') === "Cancel"){
				
			} else {
				CollectionList.removeChild(collectionElement);
				delete collectionsList[collectionElement.getAttribute('name')]
	
				ipcRenderer.send('updateCollectionDB', collectionsList)
	
				boxInfo.classList.remove('show');
			}
			
		});
		m3.addEventListener('click', function (event) {
			showCollectionContextMenu(collectionElement)
		})
		m1.addEventListener('mouseover', function (event) {
			handleMouseOver(event, m1);
		});
		m1.addEventListener('mouseout', handleMouseOut);

		m2.addEventListener('mouseover', function (event) {
			handleMouseOver(event, m2);
		});
		m2.addEventListener('mouseout', handleMouseOut);
		nbMaps = collectionsList[collectionName].length
	})

	let lastCollectionName = null;
	for (let collectionName in collectionsList) {
		lastCollectionName = collectionName;
	}


	document.getElementById('currentCollectionName').innerText = `${lastCollectionName} (${nbMaps})`
	let arrayCollections = Object.entries(collectionsList).map(([key, value]) => {
		return { [key]: value };
	});
	let lastElement = arrayCollections[arrayCollections.length - 1];

	let keyOfLastElement = Object.keys(lastElement)[0];
	let itemsOfLastCollection = lastElement[keyOfLastElement];

	itemsOfLastCollection.forEach(item => {

		let beatmapElement = document.createElement("div");
		beatmapElement.className = "beatmap-element";
		beatmapElement.setAttribute("data-bmid", "3082320");
		beatmapElement.setAttribute("data-scoreid", "2479538123");
		beatmapElement.setAttribute("data-timestamp", "1710022620");
		beatmapElement.setAttribute("data-pp", "157");
		beatmapElement.setAttribute("data-accuracy", "96.88");
		beatmapElement.setAttribute("data-difficulty", "5.20");
		beatmapElement.setAttribute("data-note", "4");


		let bmInfos = document.createElement("div");
		bmInfos.className = "elem bm_infos";

		let mapTitle = document.createElement("span");
		mapTitle.className = "map_title";
		mapTitle.textContent = item.data.title;

		let underInfos = document.createElement("span");
		underInfos.className = "under-infos";

		let level = document.createElement("l");
		level.textContent = item.data.difficulty;

		let date = document.createElement("d");
		date.textContent = null

		let stars = document.createElement("span");
		stars.textContent = "? ★ ";

		let innerStars = document.createElement("i");
		innerStars.textContent = null

		underInfos.appendChild(level);
		underInfos.appendChild(document.createTextNode(" - "));
		underInfos.appendChild(date);
		underInfos.appendChild(document.createTextNode(" - "));
		underInfos.appendChild(stars);
		underInfos.appendChild(innerStars);

		// Assemblage du contenu de bmInfos
		bmInfos.appendChild(mapTitle);
		bmInfos.appendChild(underInfos);


		beatmapElement.appendChild(bmInfos);
		document.getElementById('collectionItemList').insertBefore(beatmapElement, (document.getElementById('collectionItemList').children[1]));

	});

}
setTimeout(() => {
	setInterval(async () => {
		document.getElementById('currentTimeMusic').innerText = ctm(wsData.menu.bm.time.current, wsData.menu.bm.time.full)
		document.getElementById('totalTimeMusic').innerText = ctm(wsData.menu.bm.time.full, wsData.menu.bm.time.full)
		let backgroundCurrentMap = document.getElementById('backgroundCurrentMap')
		if (currentBeatmapId !== wsData.menu.bm.id) {

			document.getElementById('musicAuthor').innerText = wsData.menu.bm.metadata.artist
			document.getElementById('musicMapper').innerText = wsData.menu.bm.metadata.mapper
			document.getElementById('musicTitle').innerText = wsData.menu.bm.metadata.title
			let rs = (wsData.menu.bm.rankedStatus).toString()

			switch (rs) {
				case "6":
					rs = "Qualified"
					break;
				case "2":
					rs = "WIP/Graveyard"
					break;
				case "4":
					rs = "Ranked"
					break;
				case "1":
					rs = "Graveyard"
					break;
				case "5":
					rs = "Qualified"
					break;
				case "7":
					rs = "Loved"
					break;
				default:
					break;
			}
			bm_stats_holders.hp.innerText = wsData.menu.bm.stats.HP
			bm_stats_holders.od.innerText = wsData.menu.bm.stats.OD
			bm_stats_holders.cs.innerText = wsData.menu.bm.stats.CS
			bm_stats_holders.ar.innerText = wsData.menu.bm.stats.AR
			bm_stats_holders.sr.innerText = wsData.menu.bm.stats.fullSR
			bm_stats_holders.bpm.innerText = wsData.menu.bm.stats.BPM.common
			bm_stats_holders.difficulty.innerText = wsData.menu.bm.metadata.difficulty
			bm_stats_holders.fc95.innerText = (parseInt(wsData.menu.pp['95'])).toFixed(2) + " PP"
			bm_stats_holders.fc98.innerText = (parseInt(wsData.menu.pp['98'])).toFixed(2) + " PP"
			bm_stats_holders.fc100.innerText = (parseInt(wsData.menu.pp['100'])).toFixed(2) + " PP"
			bm_stats_holders.mapStatus.innerText = rs
			currentBeatmapId = wsData.menu.bm.id
			shareBtn.setAttribute('data-beatmapId', wsData.menu.bm.id)
			shareBtn.setAttribute('data-beatmapsetId', wsData.menu.bm.set)
			shareBtn.setAttribute('data-gamemode', wsData.menu.gameMode)

			openBtn.setAttribute('data-beatmapId', wsData.menu.bm.id)
			openBtn.setAttribute('data-beatmapsetId', wsData.menu.bm.set)
			openBtn.setAttribute('data-gamemode', wsData.menu.gameMode)
		}

		if (backgroundCurrentMap.getAttribute('src') !== `${wsData.settings.folders.songs}\\${wsData.menu.bm.path.full}` && toggles.global_page === "gameplay_page") {
			backgroundCurrentMap.setAttribute('src', `${wsData.settings.folders.songs}\\${wsData.menu.bm.path.full}`)
			var basePath = wsData.settings.folders.songs.replace(/\\/g, '/');
			var imagePath = wsData.menu.bm.path.full.replace(/\\/g, '/');
			var fullUrl = encodeURI(`${basePath}/${imagePath}`);
			document.getElementById('root').style.backgroundImage = `url('${fullUrl}')`;
		}
	}, pollrateGameplay);
}, 2000)

updateHandles();
ipcRenderer.on('player-data', (event, data) => {
	
	IntroduceDataPlayer(data)
})
ipcRenderer.on('notification', (event, content, type) => {
	showNotificationBox(content, type)
})
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
ipcRenderer.on('api', (event, data) => {
	if (data.event === 'createHTMLObject') {
		document.getElementById('endOfNav').insertAdjacentHTML('afterend', data.HTML);
	}
})
ipcRenderer.on('selected-directory', (event, pathId, path) => {
	document.getElementById(pathId).value = path;
})
ipcRenderer.on('file-check-failed', (event, pathId) => {
	showNotificationBox('Please select an Osu! Folder', 'warning')
})
ipcRenderer.on('settings', (event, data, software_info) => {
	loadSettings(data)
	console.log(data);
	document.getElementById('software_infos').innerText = `v${software_info}`
})
ipcRenderer.on('collections', (event, collections) => {
	CollectionList = collections
	createCollectionsHandler(collections)
})
ipcRenderer.on('importCLBFDone', (event, importedCollection) => {
	console.log(importedCollection)
})
ipcRenderer.on('export-finished', (event, collectionName) => {
	document.getElementById(`collection-${collectionName}`).classList.remove('show')
})
left_menu.addEventListener('click', function (event) {
	if (event.target.getAttribute('id') == 'side_left_menu' &&
		event.offsetX >= left_menu.offsetWidth - 12) {
		if (toggles.left_menu) {
			left_menu.classList.add('hide');
			content.classList.add('full')
			left_menu.style.setProperty('--after-content', '""')
			setTimeout(() => {
				left_menu.style.setProperty('--after-content', '"❭"')
				left_menu.style.setProperty('--after-content-width-left', '1%')
				toggles.left_menu = false
			}, 150);
		} else {
			left_menu.classList.remove('hide');
			content.classList.remove('full')
			left_menu.style.setProperty('--after-content', '""')
			setTimeout(() => {
				left_menu.style.setProperty('--after-content', '"❬"')
				left_menu.style.setProperty('--after-content-width-left', '13.4%')
				toggles.left_menu = true
			}, 150)
		}
	}
})

window.addEventListener('resize', updateHandles);
document.addEventListener('mousemove', updateHandles);
bg.addEventListener('mousemove', (e) => {
	const mouseX = e.clientX / windowWidth;
	const mouseY = e.clientY / windowHeight;

	bg.style.backgroundPositionX = `${mouseX}%`;
	bg.style.backgroundPositionY = `${mouseY + 20}%`;
})
document.getElementById('importCLBF').addEventListener('click', function (event){
	ipcRenderer.send('open-directory-clbf')
})

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
document.addEventListener('DOMContentLoaded', async () => {
	ipcRenderer.send('getLang', null)
	ipcRenderer.on('lang', (lg, dictionnary) => {
		translations = JSON.parse(dictionnary)
		setTranslations()
	})
})
//    Nombre de jours
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

function getCountryTimeZone(countryCode) {
	const countryTimeZones = {
		'FR': 'Europe/Paris',    // France
		'US': 'America/New_York', // USA
		'GB': 'Europe/London',  // United Kingdom
		'DE': 'Europe/Berlin',  // Germany
		'CN': 'Asia/Shanghai',  // China
		'IN': 'Asia/Kolkata',   // India
		'JP': 'Asia/Tokyo',     // Japan
		'BR': 'America/Sao_Paulo', // Brazil
		'AU': 'Australia/Sydney',  // Australia
		// Ajoutez d'autres pays et leurs fuseaux horaires ici
	};

	return countryTimeZones[countryCode] || 'UTC'; // Retourne 'UTC' si le code pays n'est pas trouvé
}

function getLocalizedTime(data) {
	let format = "DD/MM/YYYY HH[h]mm";
	let timeZone = getCountryTimeZone(data.country_code);

	// Convertir et formater la date
	let localizedTime = moment(data.last_update).tz(timeZone).format(format);
	return localizedTime;
}