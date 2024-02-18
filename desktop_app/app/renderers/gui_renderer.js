var hitErrorArrayTab
var key1ArrayHits = [] var key2ArrayHits = [] const { ipcRenderer } = require('electron');
const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);
const BPDPC = require('osu-bpdpc');
const ReconnectingWebSocket = require('../server/gosumemory_handler');
const { json } = require('express');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
var ts = 0
var playing = false
var wsData = null
var basic_infos
var gameplay
var missChecker = { Miss : 0, checked : false } var sbChecker = {
	SB : 0,
	checked : false
} var audioCache;

ipcRenderer.on('audio-cache', (event, cache) => {
	audioCache = cache;
});
ipcRenderer.on('player-data', (event, data) => {
    const player_data = data
basic_infos = player_data.basic_informations
console.log(player_data)
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
		document.getElementById('welcomeRank').innerText = `Rank: ${
			gameplay['m' + defaultMod].global_rank} (${
			gameplay['m' + defaultMod].country_rank} ${basic_infos.country})`
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

	function playVoice(language, type) {
		console.log(audioCache);

		if (audioCache) {
			const filteredResults = audioCache.filter((voiceInfo) => {
				return voiceInfo.language === language && voiceInfo.type === type;
			});

			if (filteredResults.length === 0) {
				console.error(
					'Aucun résultat trouvé pour la langue et le type spécifiés.');
				return;
			}
			function rd() {
				const randomIndex = Math.floor(Math.random() * 7);
				const randomVoiceInfo = filteredResults[randomIndex];
				if (randomVoiceInfo.buffer.length >= 1) {
					play(randomVoiceInfo)
				} else {
					rd()
				}
			}
			rd()
			function play(randomVoiceInfo) {
				const source = audioContext.createBufferSource();
				var rdBuffer = new Uint8Array(randomVoiceInfo.buffer)
				console.log(rdBuffer)
				audioContext.decodeAudioData(
					rdBuffer.buffer,
					(audioBuffer) => {
						source.buffer = audioBuffer;
						source.connect(audioContext.destination);
						source.start(0);
					},
					(error) => {
						console.error(
							'Erreur lors du décodage du fichier audio :',
							error);
					});
			}

		} else {
			console.error(
				'Le cache audio est vide. Chargez d\'abord les voix.');
		}
	}

	let socket = new ReconnectingWebSocket('ws://127.0.0.1:24050/ws');
	socket.onopen = (event) => console.log(event);
	socket.onclose = event => {
		socket.send('Client Closed!');
	};
	socket.onerror = error => console.log('Socket Error: ', error);
	socket.onmessage = event => {
		let data = JSON.parse(event.data)
		wsData = data
		if (ts !== data.menu.bm.time.current && data.gameplay.name) {
			playing = true
		}
		else { playing = false } ts = data.menu.bm.time.current
	}

	const earlyAccess
		= false
	if (earlyAccess) {
		document.querySelectorAll('.btn-menu').forEach(function(btn) {
			const dataId = btn.getAttribute('data-id');
			console.log(dataId)
			if (dataId === 'HomePage' || dataId === 'RefHelperPage' || dataId === 'DocPage') {
			}
			else {
				btn.classList.add('btn-disable');
			}
		});
	}

	setInterval(async () => {
		if (playing) {
			if (wsData.gameplay.hits.unstableRate >= 250) {
				playVoice('FR', 'ur')
			}
		}
	}, 20000);

	setInterval(async () => {
		if (playing) {
			const sum = hitErrorArrayTab.reduce((acc, num) => acc + num, 0);
			const average = sum / hitErrorArrayTab.length;
			if (average <= -10 || average >= 10) {
				if (average <= -10) {
					playVoice('FR', 'tolate')
				} else {
					playVoice('FR', 'toquickly')
				}
			}
		}
	}, 10000);
	function setActiveButton(button) {
		const dataId = button.getAttribute('data-id');
		if (dataId === 'GamePlayPage') {
			ipcRenderer.send('isGamePlayPage', true)
		} else {
			ipcRenderer.send('isGamePlayPage', false)
		}
		if (dataId === 'RefHelperPage') {
			const btnMenus = document.querySelectorAll('.btn-menu');
			let oldPage
			btnMenus.forEach(btnMenu => {
				if (btnMenu.classList.contains('active')) {
					const btnMenus = document.querySelectorAll('.btn-menu');
					btnMenus.forEach(btnMenu => {
						if (btnMenu.classList.contains('active')) {
							oldPage = btnMenu.getAttribute('data-id');
							console.log(oldPage)
						}
					});
					ipcRenderer.send('refHelper-handler', oldPage)
				}
			});

			document.querySelectorAll('.main-content')
				.forEach(function(content) {
					content.classList.remove('active');
				});
			const mainContent = document.getElementById(dataId);
			mainContent.classList.add('active');
			document.querySelectorAll('.btn-menu').forEach(function(btn) {
				btn.classList.remove('active');
			});
			button.classList.add('active');
			updateIndicatorPosition(button);
		}

		document.querySelectorAll('.main-content').forEach(function(content) {
			content.classList.remove('active');
		});

		const mainContent = document.getElementById(dataId);
		mainContent.classList.add('active');
		document.querySelectorAll('.btn-menu').forEach(function(btn) {
			btn.classList.remove('active');
		});
		button.classList.add('active');
		updateIndicatorPosition(button);
	}
	ipcRenderer.on('backPage', (event, pageId) => {
		const button = document.querySelector(`[data-id="${pageId}"]`);
		if (button) {
			setActiveButton(button);
		}
	})
	function updateIndicatorPosition(activeButton) {
		const indicator = document.querySelector('.indicator');
		const activeButtonRect = activeButton.getBoundingClientRect();
		indicator.style.transform = `translateX(${activeButtonRect.left}px)`;
	}
	function toggleIcon(btn) {
		const icons = btn.querySelectorAll('ion-icon');
		icons.forEach(function(icon) {
			const iconName = icon.getAttribute('name');
			if (btn.classList.contains('active')) {
				if (iconName.endsWith('-outline')) {
					icon.setAttribute('name', iconName.replace('-outline', ''));
				}
			} else {
				if (!iconName.endsWith('-outline')) {
					icon.setAttribute('name', iconName + '-outline');
				}
			}
		});
	}
	const navBtnActions = document.querySelectorAll('.users-tools .nav-btn-action');
	const openBoxEdit = document.querySelector('.open-boxedit');
	navBtnActions.forEach(function(navBtnAction) {
		navBtnAction.addEventListener('click', function(event) {
			navBtnActions.forEach(function(otherBtn) {
				if (otherBtn !== navBtnAction) {
					otherBtn.classList.remove('active');
					toggleIcon(otherBtn);
				}
			});
			navBtnAction.classList.toggle('active');
			toggleIcon(navBtnAction);
			const isAnyActive = Array.from(navBtnActions)
									.some(btn => btn.classList.contains('active'));
			openBoxEdit.classList.toggle('reply', !isAnyActive);
		});
	});
	document.addEventListener('click', function(event) {
		if (!event.target.closest('.users-tools') && !event.target.closest('.nav-btn-action')) {
			navBtnActions.forEach(function(btn) {
				btn.classList.remove('active');
				toggleIcon(btn);
			});
			openBoxEdit.classList.add('reply');
		}
	});

	const musicPlayer = document.getElementById('musicPlayer')
	ipcRenderer.on('resetPlayer', (event, data, bm, t, scores, bm_status) => {
		if (bm_status === 1) {
			document.getElementById('bm_status').innerText = 'RANKED'
		} else if (bm_status === 4) {
			document.getElementById('bm_status').innerText = 'LOVED'
		} else if (bm_status === 0 || bm_status === -1) {
			document.getElementById('bm_status').innerText = 'PENDING'
		} else {
			document.getElementById('bm_status').innerText = 'GRAVEYARD'
		}
		let background_path = null

		if (bm.bm.path.full) {
			background_path = `${(t.settings.folders.songs).replace(/\\/g, '/')}/${
				(bm.bm.path.full).replace(/\\/g, '/')}`
		}
		else { background_path = null }

		document.getElementById('specificsMap')
			.innerHTML
			= 'Wait..'
		if (scores) {
			document.getElementById('specificsMap').innerHTML = ''
			scores.forEach((score, index) => {
				setTimeout(() => {
					const scoreContainerElement = document.createElement('div');
					scoreContainerElement.innerHTML = score.html;
					document.getElementById('specificsMap')
						.appendChild(scoreContainerElement);
				}, index * 100);
			});
		}

		document.getElementById('musicPlayer').style.background = `url("${background_path}")`
		document.getElementById('music_info_title').innerText = `${bm.bm.metadata.title} - ${bm.bm.metadata.artist}`
		document.getElementById('music_info_diff').innerText = `${bm.bm.metadata.difficulty}`
		document.getElementById('music_info_author').innerText = `Mapped By ${bm.bm.metadata.mapper}`

		let hp = document.getElementById('bm_stats_hp')
		let od = document.getElementById('bm_stats_od')
		let cs = document.getElementById('bm_stats_cs')
		let sr = document.getElementById('bm_stats_sr')
		let ar = document.getElementById('bm_stats_ar')
		let kc = document.getElementById('bm_stats_kc')

		switch (bm.gameMode) {
		case 0:
			document.getElementById('bm_stats_handler_hp')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_od')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_cs')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_sr')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_ar')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_kc')
				.classList.add('unsued')
			hp.innerText = bm.bm.stats.HP
			od.innerText = bm.bm.stats.OD
			cs.innerText = bm.bm.stats.CS
			ar.innerText = bm.bm.stats.AR
			sr.innerText = bm.bm.stats.SR
			hp.style.width = `${Math.min((bm.bm.stats.HP / 10) * 100)}%`
			od.style.width = `${Math.min((bm.bm.stats.OD / 10) * 100)}%`
			cs.style.width = `${Math.min((bm.bm.stats.CS / 10) * 100)}%`
			ar.style.width = `${Math.min((bm.bm.stats.AR / 10) * 100)}%`
			sr.style.width = `${Math.min((bm.bm.stats.SR / 20) * 100)}%`
			break;
		case 1:
			document.getElementById('bm_stats_handler_hp')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_od')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_cs')
				.classList.add('unsued')
			document.getElementById('bm_stats_handler_sr')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_ar')
				.classList.add('unsued')
			document.getElementById('bm_stats_handler_kc')
				.classList.add('unsued')
			hp.innerText = bm.bm.stats.HP
			od.innerText = bm.bm.stats.OD
			sr.innerText = bm.bm.stats.SR
			hp.style.width = `${Math.min((bm.bm.stats.HP / 10) * 100)}%`
			od.style.width = `${Math.min((bm.bm.stats.OD / 10) * 100)}%`
			sr.style.width = `${Math.min((bm.bm.stats.SR / 20) * 100)}%`
			break;
		case 2:
			document.getElementById('bm_stats_handler_hp')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_od')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_cs')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_sr')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_ar')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_kc')
				.classList.add('unsued')
			hp.innerText = bm.bm.stats.HP
			od.innerText = bm.bm.stats.OD
			cs.innerText = bm.bm.stats.CS
			ar.innerText = bm.bm.stats.AR
			sr.innerText = bm.bm.stats.SR
			hp.style.width = `${Math.min((bm.bm.stats.HP / 10) * 100)}%`
			od.style.width = `${Math.min((bm.bm.stats.OD / 10) * 100)}%`
			cs.style.width = `${Math.min((bm.bm.stats.CS / 10) * 100)}%`
			ar.style.width = `${Math.min((bm.bm.stats.AR / 10) * 100)}%`
			sr.style.width = `${Math.min((bm.bm.stats.SR / 20) * 100)}%`
			break;
		case 3:
			document.getElementById('bm_stats_handler_hp')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_od')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_cs')
				.classList.add('unsued')
			document.getElementById('bm_stats_handler_sr')
				.classList.remove('unsued')
			document.getElementById('bm_stats_handler_ar')
				.classList.add('unsued')
			document.getElementById('bm_stats_handler_kc')
				.classList.remove('unsued')
			hp.innerText = bm.bm.stats.HP
			od.innerText = bm.bm.stats.OD
			sr.innerText = bm.bm.stats.SR
			hp.style.width = `${Math.min((bm.bm.stats.HP / 10) * 100)}%`
			od.style.width = `${Math.min((bm.bm.stats.OD / 10) * 100)}%`
			sr.style.width = `${Math.min((bm.bm.stats.SR / 20) * 100)}%`
			break;
		}
		musicPlayer.classList.remove('music__player__offline')
	})
ipcRenderer.on('launchedApp', (event, data)=> {
  document.getElementById('software_version').innerText = `v${data.app_version}`
  document.getElementById('application_id').innerText = `client id: ${data.client_id}`
})

  // ipcRenderer.on('currentPlay', (event, data) => {

  // })
  const progressBar = document.getElementById('progressbar');
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
  function updateProgressBar(actual, total) {
	  const progress = (actual / total) * 100;
	  progressBar.style.width = progress + '%';
  }
  ipcRenderer.on(
	  'fader', (event, fader) => { document.body.classList.add(fader) })
  ipcRenderer.on('initGUI', async (event, data) => {
	  const defaultMod = data.playmode
	  document.getElementById('userAvatar').src = data.avatar_url;
	  document.getElementById('welcomePseudo').innerText = data.username;
	  document.getElementById('welcomeRank').innerText = `Rank: ${data.statistics_rulesets[defaultMod].global_rank} (${
		  data.statistics.rank.country} ${data.country_code})`
	  document.getElementById('welcomePP').innerText = `${parseInt(data.statistics_rulesets[defaultMod].pp)} PP`
	  document.getElementById('userStat_classedScore').innerText = `${data.statistics.ranked_score}`;
	  document.getElementById('userStat_classedPlays').innerText = `${data.statistics.play_count}`;
	  document.getElementById('userStat_TotalScore').innerText = `${data.statistics.total_score}`;
	  document.getElementById('userStat_Accuracy').innerText = `${(data.statistics.hit_accuracy).toFixed(2)} %`;
	  document.getElementById('userStat_nbClick').innerText = `${data.statistics.total_hits}`;
	  document.getElementById('userStat_maxCombo').innerText = `${data.statistics.maximum_combo}`

	  document.getElementById('userStat_nb_ssh').innerText = `${data.statistics.grade_counts.ssh}`;
	  document.getElementById('userStat_nb_ss').innerText = `${data.statistics.grade_counts.ss}`;
	  document.getElementById('userStat_nb_sh').innerText = `${data.statistics.grade_counts.sh}`;
	  document.getElementById('userStat_nb_s').innerText = `${data.statistics.grade_counts.s}`;
	  document.getElementById('userStat_nb_a').innerText = `${data.statistics.grade_counts.a}`;
	  rankHistoryUpdate(data.rank_history.data)
  })
  ipcRenderer.on('tp_format', (event, scoreContainers) => {
	  var container = document.getElementById('best_scores');
	  container.innerHTML = scoreContainers;
  })
ipcRenderer.on('userInfos', (event, data) => {
  document.getElementById('welcomePseudo').innerText = `Welcome, ${data['username']} !`
document.getElementById('welcomeGlobalRank').innerText = ``
document.getElementById('welcomePP').innerText``
data.playmode
data.is_supporter
  data.avatar.url 
})

ipcRenderer.on('gosumemory', (event, data) => {
  document.getElementById('musicPlayer').classList.remove('hidden')
document.getElementById('bmstats').classList.remove('hidden')
  document.getElementById('topranks').classList.remove('hidden')
})

  ipcRenderer.on('startPlaying', (event, bm) => {
	  hitErrorArrayTab = []
	  key1ArrayHits = []
	  key2ArrayHits = [] const container = document.getElementById('playing_keys');
  })

  // ipcRenderer.on('dataPlaying', (event, gameplay, bm) => {

  // })
  setTimeout(() => {
	  setInterval(async () => {
		  // if()
		  updateProgressBar(
			  wsData.menu.bm.time.current, wsData.menu.bm.time.full);
		  document.getElementById('timeElapsed').innerHTML = `
    <span>${
			  ctm(wsData.menu.bm.time.current,
				  wsData.menu.bm.time.full)}</span>-<span>${
			  ctm(wsData.menu.bm.time.full, wsData.menu.bm.time.full)}</span>`
		  document.getElementById('MusictimeElapsed').innerHTML = `
    <span>${
			  ctm(wsData.menu.bm.time.current,
				  wsData.menu.bm.time.mp3)}</span>-<span>${
			  ctm(wsData.menu.bm.time.mp3, wsData.menu.bm.time.mp3)}</span>
    `

		  document.getElementById('gameplayStat_300_g').innerText = fnws(wsData.gameplay.hits.geki)
		  document.getElementById('gameplayStat_300').innerText = fnws(wsData.gameplay.hits['300'])
		  document.getElementById('gameplayStat_200').innerText = fnws(wsData.gameplay.hits.katu)
		  document.getElementById('gameplayStat_100').innerText = fnws(wsData.gameplay.hits['100'])
		  document.getElementById('gameplayStat_50').innerText = fnws(wsData.gameplay.hits['50'])
		  document.getElementById('gameplayStat_miss').innerText = fnws(wsData.gameplay.hits['0'])
		  document.getElementById('gameplayStat_sb').innerText = fnws(wsData.gameplay.hits.sliderBreaks)
		  document.getElementById('gameplayStat_score').innerText = fnws(wsData.gameplay.score)
		  document.getElementById('gameplayStat_rank').innerText = wsData.gameplay.hits.grade.current
		  document.getElementById('gameplayStat_acc').innerText = `${wsData.gameplay.accuracy} %`
		  document.getElementById('gameplayStat_combo').innerText = fnws(wsData.gameplay.combo.current)
		  document.getElementById('gameplayStat_mcombo').innerText = fnws(wsData.gameplay.combo.max)

		  if (parseInt(missChecker.Miss) !== parseInt((wsData.gameplay.hits['0'] + wsData.gameplay.hits.sliderBreaks))) {
			  missChecker.Miss = wsData.gameplay.hits['0'] + wsData.gameplay.hits.sliderBreaks
			  missChecker.checked = false
		  }

		  if (parseInt(missChecker.Miss) !== parseInt((wsData.gameplay.hits['0'] + wsData.gameplay.hits.sliderBreaks))) {
			  missChecker.Miss = wsData.gameplay.hits['0'] + wsData.gameplay.hits.sliderBreaks
			  missChecker.checked = false
		  }

		  if (!missChecker.checked) {
			  missChecker.checked = true
			  const keyPressed = document.querySelectorAll('.pressed');
			  keyPressed.forEach(function(element) {
				  element.classList.add('missed')
				  setTimeout(
					  () => { element.classList.remove('missed')

					  },
					  100);
			  });
		  }

		  if (parseInt(sbChecker.Miss) !== parseInt((wsData.gameplay.hits.sliderBreaks))) {
			  sbChecker.Miss = wsData.gameplay.hits['0'] + wsData.gameplay.hits.sliderBreaks
			  sbChecker.checked = false
		  }

		  if (!sbChecker.checked) {
			  sbChecker.checked = true
			  // playVoice('FR', 'aim')
		  }
		  let lastHit = [] const gameplay = wsData.gameplay
		  if (gameplay.hits.hitErrorArray) {
			  hitErrorArrayTab = gameplay.hits.hitErrorArray.slice(-200);
			  lastHit = gameplay.hits.hitErrorArray.slice(-1);
		  }

		  const key1 = document.getElementById('keyPressed1')
		  const key2 = document.getElementById('keyPressed2')

		  document.getElementById('urStat').innerText = `UR: ${parseInt(gameplay.hits.unstableRate)}`
		  if (gameplay.keyOverlay.k1.isPressed) {
			  key1.classList.add('pressed')
			  key1ArrayHits.push([ lastHit, gameplay.hits.unstableRate ]);
		  }
		  else {
			  key1.classList.remove('pressed')
		  }
		  if (gameplay.keyOverlay.k2.isPressed) {
			  key2.classList.add('pressed')
			  key2ArrayHits.push([ lastHit, gameplay.hits.unstableRate ]);

		  } else {
			  key2.classList.remove('pressed')
		  }

		  await rankHitErrors(hitErrorArrayTab)
		  const k1 = calcAVGk1()
		  const k2 = calcAVGk2()

		  document.getElementById('k1avg').innerText = `UR ~ ${parseInt(k1.avgUnstableRate)}`
		  document.getElementById('k2avg').innerText = `UR ~ ${parseInt(k2.avgUnstableRate)}`
		  document.getElementById('k1avg2').innerText = `~ ${(k1.avgLastHit).toFixed(2)} ms`
		  document.getElementById('k2avg2').innerText = `~ ${(k2.avgLastHit).toFixed(2)} ms`

		  if (k2.avgLastHit <= -5 || k2.avgLastHit >= 5) {
			  document.getElementById('k2avg2').classList.remove('ok')
			  document.getElementById('k2avg2').classList.add('err')
		  }
		  else {
			  document.getElementById('k2avg2').classList.remove('err')
			  document.getElementById('k2avg2').classList.add('ok')
		  }
		  if (k1.avgLastHit <= -5 || k1.avgLastHit >= 5) {
			  document.getElementById('k1avg2').classList.remove('ok')
			  document.getElementById('k1avg2').classList.add('err')
		  } else {
			  document.getElementById('k1avg2').classList.remove('err')
			  document.getElementById('k1avg2').classList.add('ok')
		  }

		  function calcAVGk2() {
			  let sumLastHit = 0;
			  let sumUnstableRate = 0;
			  let validCount = 0;
			  for (let i = 0; i < key2ArrayHits.length; i++) {
				  const subArray = key2ArrayHits[i];
				  const lastHitValue = parseFloat(subArray[0]);
				  if (!isNaN(lastHitValue)) {
					  sumLastHit += lastHitValue;
					  sumUnstableRate += subArray[1];
					  validCount++;
				  }
			  }
			  const avgLastHit = validCount > 0 ? sumLastHit / validCount : 0;
			  const avgUnstableRate = validCount > 0 ? sumUnstableRate / validCount : 0;
			  return { avgLastHit, avgUnstableRate };
		  }
		  function calcAVGk1() {
			  let sumLastHit = 0;
			  let sumUnstableRate = 0;
			  let validCount = 0;
			  for (let i = 0; i < key1ArrayHits.length; i++) {
				  const subArray = key1ArrayHits[i];
				  const lastHitValue = parseFloat(subArray[0]);
				  if (!isNaN(lastHitValue)) {
					  sumLastHit += lastHitValue;
					  sumUnstableRate += subArray[1];
					  validCount++;
				  }
			  }
			  const avgLastHit = validCount > 0 ? sumLastHit / validCount : 0;
			  const avgUnstableRate = validCount > 0 ? sumUnstableRate / validCount : 0;
			  return { avgLastHit, avgUnstableRate };
		  }
	  }, 1);
  }, 100);

  ipcRenderer.on('endPlaying', (event, result) => {})
  ipcRenderer.on('leftPlaying', (event) => {})
  ipcRenderer.on('data', (event, gosumemory) => {
	  if (!gosumemory) {
		  document.getElementById('musicPlayer').classList.add('hidden')
		  document.getElementById('bmstats').classList.add('hidden')
		  document.getElementById('topranks').classList.add('hidden')
	  } else {
		  document.getElementById('musicPlayer').classList.remove('hidden')
		  document.getElementById('bmstats').classList.remove('hidden')
		  document.getElementById('topranks').classList.remove('hidden')
	  }
  });

  var modBtns = document.querySelectorAll('.mod-btn');
  modBtns.forEach(function(modBtn) {
	  modBtn.addEventListener('click', function() {
		  if (modBtn.classList.contains('active')) {
			  modBtn.classList.remove('active');
			  modBtn.querySelector('.cursor').classList.remove('active');
		  } else {
			  modBtn.classList.add('active');
			  modBtn.querySelector('.cursor').classList.add('active');
		  }
	  });
  });

  async function rankHistoryUpdate(data) {
	  function generateDateLabels(numDays) {
		  const labels = [];
		  for (let i = numDays; i >= 1; i--) {
			  labels.push(`${i} day${i > 1 ? 's' : ''} ago`);
		  }
		  return labels;
	  }

	  // Nombre de jours
	  const numDays = 90;
	  const chartOptions = {
		  chart : {
			  type : 'line',
			  events : {
				  load : function() {
					  this.container.oncontextmenu = function(e) {
						  e.preventDefault();
					  };
					  const backgroundElement = document.querySelector('.highcharts-background');
					  if (backgroundElement) {
						  backgroundElement.style.fill = 'none';
					  };
				  },
			  },
		  },
		  backgroundColor : null,
		  title : {
			  text : null,
		  },
		  legend : {
			  enabled : false,
		  },
		  credits : {
			  enabled : false,
		  },
		  exporting : {
			  buttons : {
				  contextButton : {
					  enabled : false,
				  },
			  },
		  },
		  xAxis : {
			  visible : false,
			  categories : generateDateLabels(numDays),
			  color : '#a84a89'
		  },
		  yAxis : {
			  visible : false,
			  reversed : true,
			  categories : generateDateLabels(numDays),
			  color : '#a84a89'
		  },
		  series : [
			  {
				  name : 'Rank',
				  data : data,
				  color : '#a84a89',
				  animation : false,
			  },

		  ],
	  };
	  Highcharts.chart('rank_highligh', chartOptions);
  }
  async function rankHitErrors(data) {
	  function generatePositionLabels(numItems) {
		  const labels = [];
		  for (let i = 1; i <= numItems; i++) {
			  labels.push('');
		  }
		  return labels;
	  }
	  const numItems = 200;
	  const horizontalBarValue = 0;

	  const chartOptions = {
		  chart : {
			  type : 'line',
			  events : {
				  load : function() {
					  this.container.oncontextmenu = function(e) {
						  e.preventDefault();
					  };
					  const backgroundElements = document.querySelectorAll('.highcharts-background');

					  backgroundElements.forEach(function(element) {
						  element.style.fill = 'none';
					  });
				  },
			  },
		  },
		  backgroundColor : null,
		  title : {
			  text : null,
		  },
		  legend : {
			  enabled : false,
		  },
		  credits : {
			  enabled : false,
		  },
		  exporting : {
			  buttons : {
				  contextButton : {
					  enabled : false,
				  },
			  },
		  },
		  xAxis : {
			  visible : false,
			  categories : generatePositionLabels(numItems),
			  color : '#a84a89',
		  },
		  yAxis : {
			  visible : false,
			  min : -100,
			  max : 100,
			  color : '#a84a89',
		  },
		  series : [
			  {
				  name : 'Hit Error',
				  data : data,
				  color : '#a84a89',
				  marker : {
					  enabled : false,
				  },
				  animation : false,
			  },
			  {
				  type : 'line',
				  name : 'Horizontal Bar',
				  data : Array(numItems).fill(horizontalBarValue),
				  color : 'rgb(243, 176, 191)',
				  lineWidth : 2,
				  marker : {
					  enabled : false,
				  },
				  animation : false,

			  },
		  ],
	  };

	  Highcharts.chart('HitArrErr_highligh', chartOptions);
  }
  function fnws(number) {
	  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  const gamemodeElements = document.querySelectorAll('.gamemode');
  gamemodeElements.forEach(gamemode => {
	  gamemode.addEventListener('click', handleGamemodeClick);
  });
  function handleGamemodeClick(event) {
	  const clickedGamemode = event.currentTarget;
	  const gamemodeId = clickedGamemode.getAttribute('data_gm_id');
	  gamemodeElements.forEach(gamemode => {
		  gamemode.classList.remove('toggle');
	  });
	  clickedGamemode.classList.add('toggle');
	  console.log(gamemodeId)
	  IntroduceDataPlayer(gamemodeId)
  }

  // var gosumemory = [
  //         settings = {
  //         showInterface: true,
  //         folders: {
  //         game: "",
  //         skin: "",
  //         songs: ""
  //         }
  //     },
  //     menu = {
  //         mainMenu: {
  //         bassDensity: 0
  //         },
  //         state: 0,
  //         gameMode: 0,
  //         isChatEnabled: 0,
  //         bm: {
  //         time: {
  //             firstObj: 0,
  //             current: 0,
  //             full: 0,
  //             mp3: 0
  //         },
  //         id: 0,
  //         set: 0,
  //         md5: "",
  //         rankedStatus: 0,
  //         metadata: {
  //             artist: "",
  //             artistOriginal: "",
  //             title: "",
  //             titleOriginal: "",
  //             mapper: "",
  //             difficulty: ""
  //         },
  //         stats: {
  //             AR: 0,
  //             CS: 0,
  //             OD: 0,
  //             HP: 0,
  //             SR: 0,
  //             BPM: {
  //             min: 0,
  //             max: 0
  //             },
  //             maxCombo: 0,
  //             fullSR: 0,
  //             memoryAR: 0,
  //             memoryCS: 0,
  //             memoryOD: 0,
  //             memoryHP: 0
  //         },
  //         path: {
  //             full: "",
  //             folder: "",
  //             file: "",
  //             bg: "",
  //             audio: ""
  //         },
  //         mods: {
  //             num: 0,
  //             str: ""
  //         },
  //         pp: {
  //             100: 0,
  //             99: 0,
  //             98: 0,
  //             97: 0,
  //             96: 0,
  //             95: 0,
  //             strains: [0]
  //         }
  //         },
  //         gameplay: {
  //         gameMode: 0,
  //         name: "",
  //         score: 0,
  //         accuracy: 0,
  //         combo: {
  //             current: 0,
  //             max: 0
  //         },
  //         hp: {
  //             normal: 0,
  //             smooth: 0
  //         },
  //         hits: {
  //             300: 0,
  //             geki: 0,
  //             100: 0,
  //             katu: 0,
  //             50: 0,
  //             0: 0,
  //             sliderBreaks: 0,
  //             grade: {
  //             current: "",
  //             maxThisPlay: ""
  //             },
  //             unstableRate: 0,
  //             hitErrorArray: null
  //         },
  //         pp: {
  //             current: 0,
  //             fc: 0,
  //             maxThisPlay: 0
  //         },
  //         keyOverlay: {
  //             k1: {
  //             isPressed: false,
  //             count: 0
  //             },
  //             k2: {
  //             isPressed: false,
  //             count: 0
  //             },
  //             m1: {
  //             isPressed: false,
  //             count: 0
  //             },
  //             m2: {
  //             isPressed: false,
  //             count: 0
  //             }
  //         },
  //         leaderboard: {
  //             hasLeaderboard: false,
  //             isVisible: false,
  //             ourplayer: {
  //             name: "",
  //             score: 0,
  //             combo: 0,
  //             maxCombo: 0,
  //             mods: "",
  //             h300: 0,
  //             h100: 0,
  //             h50: 0,
  //             h0: 0,
  //             team: 0,
  //             position: 0,
  //             isPassing: 0
  //             },
  //             slots: null
  //         }
  //         },
  //         resultsScreen: {
  //         name: "",
  //         score: 0,
  //         maxCombo: 0,
  //         mods: {
  //             num: 0,
  //             str: ""
  //         },
  //         300: 0,
  //         geki: 0,
  //         100: 0,
  //         katu: 0,
  //         50: 0,
  //         0: 0
  //         },
  //         tourney: {
  //         manager: {
  //             ipcState: 0,
  //             bestOF: 0,
  //             teamName: {
  //             left: "",
  //             right: ""
  //             },
  //             stars: {
  //             left: 0,
  //             right: 0
  //             },
  //             bools: {
  //             scoreVisible: false,
  //             starsVisible: false
  //             },
  //             chat: null,
  //             gameplay: {
  //             score: {
  //                 left: 0,
  //                 right: 0
  //             }
  //             }
  //         },
  //         ipcClients: null
  //         }
  //     }
  // ]