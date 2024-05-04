const { ipcRenderer } = require('electron');
const ReconnectingWebSocket = require('../server/gosumemory_handler')

ipcRenderer.on('progress_loading', (event, stat, afterError) => {
	document.getElementById('loading_error').innerText = ``

	const lastElm = document.getElementById('progress_loading').lastElementChild
	if (lastElm) {
		const loadingStat = lastElm.querySelector('div');
		loadingStat.classList.remove('loading')
		loadingStat.classList.add('ok')
		console.log(afterError)
		if(afterError){
			loadingStat.innerText = '❌'
		} else {
			loadingStat.innerText = '✓'
		}
		
		lastElm.classList.add('reduce')
	}

	const MessagEvent = `<span class="step_message">${stat}<div class="loading"></div></span>`
	document.getElementById('progress_loading')
		.insertAdjacentHTML('beforeend', MessagEvent)
})

ipcRenderer.on('ws_connect', (event) => {
	let socket = new ReconnectingWebSocket('ws://127.0.0.1:24050/ws');
	socket.onopen = () => {
		ipcRenderer.send('ws_connect_result', null)
		console.log('ok')
	};
	let send = false
	socket.onmessage = event => {
		let data = JSON.parse(event.data)
		if (!send) {
			ipcRenderer.send('ws_osu_path', data.settings.folders.game)
			send = true
		}
	}

	socket.onclose
		= event => {
			const lastElm = document.getElementById('progress_loading').lastElementChild
			lastElm.innerHTML = `Connection to the Websocket ❌`
			ipcRenderer.send('ws_connect_result', event)
			console.log('Socket Closed Connection: ', event);
			socket.send('Client Closed!');
		};
	socket.onerror = error => {
		const lastElm = document.getElementById('progress_loading').lastElementChild
		lastElm.innerHTML = `Connection to the Websocket ❌`
		ipcRenderer.send(
			'ws_connect_result',
			'Unable to connect to websocket. Please check Bella Fiora installation or If Osu! Is well started')
		console.log(error)
	};
})

ipcRenderer.on(
	'loading_err',
	(event, error) => { document.getElementById('loading_error').innerText = `${error}` })

ipcRenderer.on(
	'client_informations',
	(event,
		infos) => { document.getElementById('client_informations').innerText = `v${infos.client_version}` })
ipcRenderer.on('fader', (event, fader) => { document.body.classList.add(fader) })
ipcRenderer.on('osuError', (event, errorName) => {
	const lastElm = document.getElementById('progress_loading').lastElementChild
	lastElm.innerHTML = `${errorName} ❌`
})
