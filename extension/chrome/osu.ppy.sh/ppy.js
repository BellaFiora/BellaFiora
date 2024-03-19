
function createNotifications(data) {
	const notifElement = document.querySelector('#notification-widget-icon > span > span')
	notifElement.innerText = parseInt(notifElement.textContent) + 1
	const notification = document.createElement('div')
	notification.classList.add('notification-popup-item-group')
	const notificationPopupItem = document.createElement('div');
	notificationPopupItem.classList.add(
		'notification-popup-item', 'notification-popup-item--group',
		'notification-popup-item--user_achievement_unlock');
	const link = document.createElement('a');
	link.classList.add('notification-popup-item__link');
	link.href = data.href; // *** //
	notificationPopupItem.appendChild(link);
	const cover = document.createElement('div');
	cover.classList.add('notification-popup-item__cover');
	cover.style.backgroundImage = `url("${data.url}")`; // *** //
	notificationPopupItem.appendChild(cover);
	const coverOverlay = document.createElement('div');
	coverOverlay.classList.add('notification-popup-item__cover-overlay');
	cover.appendChild(coverOverlay);
	const coverIcon = document.createElement('div');
	coverIcon.classList.add('notification-popup-item__cover-icon');
	coverOverlay.appendChild(coverIcon);
	const medalIcon = document.createElement('span');
	medalIcon.classList.add('fas', 'fa-medal');
	coverIcon.appendChild(medalIcon);
	const main = document.createElement('div');
	main.classList.add('notification-popup-item__main');
	notificationPopupItem.appendChild(main);
	const content = document.createElement('div');
	content.classList.add('notification-popup-item__content');
	main.appendChild(content);
	const categoryRow = document.createElement('div');
	categoryRow.classList.add(
		'notification-popup-item__row',
		'notification-popup-item__row--category');
	categoryRow.textContent = data.title; // *** //
	content.appendChild(categoryRow);
	const messageRow = document.createElement('div');
	messageRow.classList.add(
		'notification-popup-item__row',
		'notification-popup-item__row--message');
	messageRow.textContent = data.subtitle; // *** //
	content.appendChild(messageRow);
	const timeRow = document.createElement('a');
	timeRow.classList.add(
		'notification-popup-item__row', 'notification-popup-item__row--time',
		'u-hover');
	timeRow.href = '{url2}'; // *** //
	content.appendChild(timeRow);
	const timeElement = document.createElement('time');
	timeElement.classList.add('js-timeago');
	timeElement.textContent = data.date;
	timeRow.appendChild(timeElement);
	const actionButton = document.createElement('button');
	actionButton.classList.add(
		'notification-action-button', 'notification-action-button--fancy');
	actionButton.type = 'button';
	main.appendChild(actionButton);
	const buttonText = document.createElement('span');
	buttonText.classList.add('notification-action-button__text');
	actionButton.appendChild(buttonText);
	const buttonIcon = document.createElement('div');
	buttonIcon.classList.add('notification-action-button__icon');
	actionButton.appendChild(buttonIcon);

	const checkIcon = document.createElement('span');
	checkIcon.classList.add('fas', 'fa-check');
	buttonIcon.appendChild(checkIcon)
	document
		.querySelector(
			'#notification-widget > div > div > div.notification-stacks')
		.appendChild(notificationPopupItem)
	actionButton.addEventListener(
		'click', (event) => { notificationPopupItem.remove() })
	// document.querySelector("#notification-widget > div > div >
	// div.notification-popup__buttons > div >
	// button").addEventListener('click', (event)=>{
	//     notificationPopupItem.remove()
	// })
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
	if (msg.request === 'createNotifications') {
		// console.log('fgekjgne')
		createNotifications({
			subtitle : 'name of beatmap',
			title : 'Bella Fiora: New Beatmap Ranked !',
			url : null,
			href : null
		})
	}
});