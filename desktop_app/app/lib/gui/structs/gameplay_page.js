(function (global) {
    function renderer(a) {
        var pageDiv = document.createElement('div');
        pageDiv.id = 'gameplay_page';
        pageDiv.className = 'page';

        var playerGlobalDiv = document.createElement('div');
        playerGlobalDiv.className = 'box box transparent player-global';
        pageDiv.appendChild(playerGlobalDiv);

        var playerMusicBgDiv = document.createElement('div');
        playerMusicBgDiv.className = 'box player-music-bg';
        playerMusicBgDiv.style.padding = '0px!important';
        var mapBackgroundDiv = document.createElement('div');
        mapBackgroundDiv.className = 'map_background';
        var mapBackgroundImg = document.createElement('img');
        mapBackgroundImg.src = '../src/cover.jpg';
        mapBackgroundImg.id = 'backgroundCurrentMap';
        mapBackgroundDiv.appendChild(mapBackgroundImg);
        playerMusicBgDiv.appendChild(mapBackgroundDiv);
        playerGlobalDiv.appendChild(playerMusicBgDiv);

        var playerTimelineDiv = document.createElement('div');
        playerTimelineDiv.className = 'box player-timeline';
        playerTimelineDiv.style.padding = '0px!important';
        var timelineProgressSpan = document.createElement('span');
        timelineProgressSpan.id = 'timelineProgress';
        playerTimelineDiv.appendChild(timelineProgressSpan);
        playerGlobalDiv.appendChild(playerTimelineDiv);

        var playerTimestampDiv = document.createElement('div');
        playerTimestampDiv.className = 'box transparent player-timestamp';
        var currentTimeMusicSpan = document.createElement('span');
        currentTimeMusicSpan.id = 'currentTimeMusic';
        currentTimeMusicSpan.textContent = '00:00';
        var totalTimeMusicSpan = document.createElement('span');
        totalTimeMusicSpan.id = 'totalTimeMusic';
        totalTimeMusicSpan.textContent = '00:00';
        playerTimestampDiv.appendChild(currentTimeMusicSpan);
        playerTimestampDiv.appendChild(totalTimeMusicSpan);
        playerGlobalDiv.appendChild(playerTimestampDiv);

        var musicInfosDiv = document.createElement('div');
        musicInfosDiv.className = 'box transparent music-infos';
        var musicTitleSpan = document.createElement('span');
        musicTitleSpan.id = 'musicTitle';
        musicTitleSpan.textContent = '....';
        var musicAuthorSpan = document.createElement('span');
        musicAuthorSpan.id = 'musicAuthor';
        musicAuthorSpan.textContent = '...';
        var musicMapperSpan = document.createElement('span');
        musicMapperSpan.id = 'musicMapper';
        musicMapperSpan.textContent = '.....';
        musicInfosDiv.appendChild(musicTitleSpan);
        musicInfosDiv.appendChild(musicAuthorSpan);
        musicInfosDiv.appendChild(musicMapperSpan);
        playerGlobalDiv.appendChild(musicInfosDiv);

        var musicActionsDiv = document.createElement('div');
        musicActionsDiv.className = 'box transparent music-actions';
        var bookmarkSpan = document.createElement('span');
        var bookmarkM = document.createElement('m');
        bookmarkM.className = 'white bookmark';
        bookmarkSpan.appendChild(bookmarkM);
        var documentSpan = document.createElement('span');
        var documentM = document.createElement('m');
        documentM.className = 'white document';
        documentM.id = 'OpenBtn';

        Object.entries({
            'data-event': 'info', 'data-info': 'Open beatmap Info on your browser',
            'data-beatmapId': '0', 'data-beatmapsetId': '-1', 'data-gamemode': '0',
            'onclick': "Link('OpenBrowser')"
        }).forEach(([key, value]) => documentM.setAttribute(key, value));

        documentSpan.appendChild(documentM);
        var shareSpan = document.createElement('span');
        var shareM = document.createElement('m');
        shareM.className = 'white share';
        shareM.id = 'shareBtn';

        Object.entries({
            'data-event': 'info', 'data-info': 'Copy link of beatmap on you clipboard',
            'data-beatmapId': '0', 'data-beatmapsetId': '-1',
            'data-gamemode': '0', 'onclick': "Link('CopyLink')"
        }).forEach(([key, value]) => shareM.setAttribute(key, value));

        shareSpan.appendChild(shareM);
        musicActionsDiv.appendChild(bookmarkSpan, documentSpan, shareSpan);
        musicActionsDiv.appendChild(documentSpan);
        musicActionsDiv.appendChild(shareSpan);
        playerGlobalDiv.appendChild(musicActionsDiv);

        var mapSpecsDiv = document.createElement('div');
        mapSpecsDiv.className = 'box transparent row mapSpecs';
        var leftSideDiv = document.createElement('div');
        leftSideDiv.className = 'left-side';
        var leftTitleDiv = document.createElement('div');
        leftTitleDiv.className = 'title';
        leftTitleDiv.textContent = 'Beatmaps specifications';
        leftSideDiv.appendChild(leftTitleDiv);

        var uniqueStats = [
            { key: 'Difficulty Name', id: 'bm_stats_difficulty' },
            { key: 'Stars Rating', id: 'bm_stats_sr' },
            { key: 'BPM', id: 'bm_stats_bpm' },
            { key: 'Approach Rate', id: 'bm_stats_ar' },
            { key: 'Cercle Size', id: 'bm_stats_cs' },
            { key: 'Overall Difficulty', id: 'bm_stats_od' },
            { key: 'Health points', id: 'bm_stats_hp' },
            { key: 'Status', id: 'bm_stats_status' },
            { key: 'Master patterns', id: 'bm_stats_master_pattern' },
            { key: 'FC 95%', id: 'bm_stats_fc95' },
            { key: 'FC 98%', id: 'bm_stats_fc98' },
            { key: 'FC 100%', id: 'bm_stats_fc100' }
        ];

        uniqueStats.forEach(stat => {
            var uniqueStatDiv = document.createElement('div');
            uniqueStatDiv.className = 'unique-stat transparent';
            var statLabel = document.createElement('label');
            var statTrs = document.createElement('trs');
            statTrs.textContent = stat.key;
            statLabel.appendChild(statTrs);
            uniqueStatDiv.appendChild(statLabel);
            var statSpan = document.createElement('span');
            statSpan.id = stat.id;
            uniqueStatDiv.appendChild(statSpan);
            leftSideDiv.appendChild(uniqueStatDiv);
        });

        var rightSideDiv = document.createElement('div');
        rightSideDiv.className = 'right-side';
        var rightTitleDiv = document.createElement('div');
        rightTitleDiv.className = 'title';
        var trsGameplay = document.createElement('trs');
        trsGameplay.textContent = 'Gameplay in Real Time';
        rightTitleDiv.appendChild(trsGameplay);
        rightSideDiv.appendChild(rightTitleDiv);
        var actualScoreDiv = document.createElement('div');
        actualScoreDiv.className = 'actualScore';
        rightSideDiv.appendChild(actualScoreDiv);

        mapSpecsDiv.appendChild(leftSideDiv);
        mapSpecsDiv.appendChild(rightSideDiv);
        playerGlobalDiv.appendChild(mapSpecsDiv);

        return pageDiv;
    }
    global.renderer = renderer

})(this);