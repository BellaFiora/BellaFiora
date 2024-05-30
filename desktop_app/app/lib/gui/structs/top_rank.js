(function (global) {
    function renderer(a) {
        const topRankElement = document.createElement('div');
        Object.entries({
            'data-bmid': a.bmId, 'data-scoreid': a.scoreId, 'data-timestamp': a.ts,
            'data-pp': a.pp, 'data-accuracy': a.acc, 'data-difficulty': a.sr, 'data-note': a.note
        }).forEach(([key, value]) => topRankElement.setAttribute(key, value));

        const rankElement = document.createElement('div');
        rankElement.className = 'elem rank';
        const noteElement = document.createElement('note');
        noteElement.className = 'a';
        rankElement.appendChild(noteElement);

        const bmInfosElement = document.createElement('div');
        bmInfosElement.className = 'elem bm_infos';
        const mapTitleElement = document.createElement('span');
        mapTitleElement.className = 'map_title';
        mapTitleElement.textContent = a.mapTitle;
        const underInfosElement = document.createElement('span');
        underInfosElement.className = 'under-infos';
        underInfosElement.innerHTML = `<l>${a.diffName}</l> - <d>${a.date}</d> - ${a.moddedDif} ★ <i>(${a.baseDiff} ★)</i>`;
        bmInfosElement.appendChild(mapTitleElement, underInfosElement);

        const modsElement = document.createElement('div');
        modsElement.className = 'elem mods';

        a.mods.forEach(mod =>
            modsElement.appendChild(
                createElement('j', { className: mod.name, 'data-event': 'info', 'data-info': mod.fullname })
            )
        );

        const accuElement = document.createElement('div');
        accuElement.className = 'elem accu';
        accuElement.textContent = `${a.acc} %`;

        const ppElement = document.createElement('div');
        ppElement.className = 'elem pp';
        ppElement.textContent = `${a.pp} PP`;

        topRankElement.append(rankElement, bmInfosElement, modsElement, accuElement, ppElement);

        return topRankElement
    }

    global.renderer = renderer
})(this);