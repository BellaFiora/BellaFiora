(function (global) {
    function renderer(array) {
        var pageDiv = document.createElement('div');
        pageDiv.id = 'home_page';
        pageDiv.className = 'page';


        var userBasicInfosDiv = document.createElement('div');
        userBasicInfosDiv.className = 'box user-basic-infos';
        pageDiv.appendChild(userBasicInfosDiv);


        var titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        userBasicInfosDiv.appendChild(titleDiv);

        var trsTitle = document.createElement('trs');
        trsTitle.setAttribute('key', 'Your Game Statistics');
        trsTitle.textContent = 'Your Game Statistics';
        titleDiv.appendChild(trsTitle);

        var subtitleSpan = document.createElement('span');
        subtitleSpan.className = 'subtitle';
        titleDiv.appendChild(subtitleSpan);

        var mRefresh = document.createElement('m');
        mRefresh.className = 'glass-grey s1 arrow-path';
        mRefresh.id = 'action_RefreshDataScores';
        mRefresh.setAttribute('data-event', 'info');
        mRefresh.setAttribute('data-info', 'Refresh Datas');
        mRefresh.style.marginTop = '2px';
        subtitleSpan.appendChild(mRefresh);

        var fStatsRefresh = document.createElement('f');
        fStatsRefresh.id = 'stats_refresh_dt';
        fStatsRefresh.textContent = '-- --';
        subtitleSpan.appendChild(fStatsRefresh);


        var btnGamemodeDiv = document.createElement('div');
        btnGamemodeDiv.className = 'btn-gamemode';
        userBasicInfosDiv.appendChild(btnGamemodeDiv);

        var modes = ['STD', 'TAIKO', 'FRUITS', 'MANIA'];
        modes.forEach(mode => {
            var modeBtnSpan = document.createElement('span');
            modeBtnSpan.className = 'modeswtichBtn';
            modeBtnSpan.id = `modeBtn${mode}`;
            modeBtnSpan.textContent = mode === 'STD' ? 'Osu!' : mode;
            btnGamemodeDiv.appendChild(modeBtnSpan);
        });


        var userStatisticsDiv = document.createElement('div');
        userStatisticsDiv.className = 'user-statistics';
        userBasicInfosDiv.appendChild(userStatisticsDiv);


        var rankingStatDiv = document.createElement('div');
        rankingStatDiv.className = 'ranking-stat';
        userStatisticsDiv.appendChild(rankingStatDiv);

        var rankingLabel = document.createElement('label');
        var rankingTrs = document.createElement('trs');
        rankingTrs.setAttribute('key', 'Ranking');
        rankingTrs.textContent = 'Ranking';
        rankingLabel.appendChild(rankingTrs);
        rankingStatDiv.appendChild(rankingLabel);

        var rankingDiv = document.createElement('div');
        rankingStatDiv.appendChild(rankingDiv);

        var countryRankingSpan = document.createElement('span');
        countryRankingSpan.setAttribute('data-event', 'info');
        countryRankingSpan.setAttribute('data-info', 'Country Ranking');
        var countryFlagM = document.createElement('m');
        countryFlagM.className = 'flag-fr s2';
        var countryRankF = document.createElement('f');
        countryRankF.id = 'stat_CountryRank';
        countryRankF.textContent = '--';
        countryRankingSpan.appendChild(countryFlagM);
        countryRankingSpan.appendChild(countryRankF);
        rankingDiv.appendChild(countryRankingSpan);

        var globalRankingSpan = document.createElement('span');
        globalRankingSpan.setAttribute('data-event', 'info');
        globalRankingSpan.setAttribute('data-info', 'Global Ranking');
        var globalM = document.createElement('m');
        globalM.className = 'globe-europe-africa glass-grey';
        globalM.style.marginRight = '-8px';
        var globalRankF = document.createElement('f');
        globalRankF.id = 'stat_GlobalRank';
        globalRankF.textContent = '--';
        globalRankingSpan.appendChild(globalM);
        globalRankingSpan.appendChild(globalRankF);
        rankingDiv.appendChild(globalRankingSpan);


        var uniqueStats = [
            { key: 'Classed Score', id: 'stat_ClassedScore', value: '--', dataValue: '2875825285', unit: '' },
            { key: 'Accuracy', id: 'stat_Accuracy', value: '-- %', dataValue: '', unit: '' },
            { key: 'Play Count', id: 'stat_PlayCount', value: '--', dataValue: '', unit: '' },
            { key: 'Total Score', id: 'stat_TotalScore', value: '--', dataValue: '12875825285', unit: '' },
            { key: 'Clicks', id: 'stat_Clicks', value: '--', dataValue: '3450211', unit: '' },
            { key: 'Combo Max', id: 'stat_ComboMax', value: '--', dataValue: '', unit: '' },
            { key: 'Master Skillset', id: 'stat_MasterSkillset', value: '--★ | MD - --★', dataValue: '', unit: '' },
            { key: 'AIM', id: 'stat_AIM', value: '-- %', dataValue: '', unit: '' }
        ];

        uniqueStats.forEach(stat => {
            var uniqueStatDiv = document.createElement('div');
            uniqueStatDiv.className = 'unique-stat';
            userStatisticsDiv.appendChild(uniqueStatDiv);

            var statLabel = document.createElement('label');
            var statTrs = document.createElement('trs');
            statTrs.setAttribute('key', stat.key);
            statTrs.textContent = stat.key;
            statLabel.appendChild(statTrs);
            uniqueStatDiv.appendChild(statLabel);

            var statSpan = document.createElement('span');
            statSpan.id = stat.id;
            statSpan.className = stat.dataValue ? 'number' : '';
            if (stat.dataValue) statSpan.setAttribute('data-value', stat.dataValue);
            statSpan.textContent = stat.value;
            uniqueStatDiv.appendChild(statSpan);
        });


        var graphRankDiv = document.createElement('div');
        graphRankDiv.id = 'graph_rank';
        userStatisticsDiv.appendChild(graphRankDiv);

        var graphRankSpan = document.createElement('span');
        var graphRankTrs = document.createElement('trs');
        graphRankTrs.setAttribute('key', 'Rank History');
        graphRankTrs.textContent = 'Rank History';
        graphRankSpan.appendChild(graphRankTrs);
        graphRankDiv.appendChild(graphRankSpan);

        var graphRankAreaDiv = document.createElement('div');
        graphRankAreaDiv.id = 'graphRanKArea';
        graphRankDiv.appendChild(graphRankAreaDiv);


        var scoresListDiv = document.createElement('div');
        scoresListDiv.className = 'box transparent scores-list';
        pageDiv.appendChild(scoresListDiv);

        var titleScoresDiv = document.createElement('div');
        titleScoresDiv.className = 'title-scores';
        scoresListDiv.appendChild(titleScoresDiv);

        var titleScoresSpan = document.createElement('span');
        titleScoresSpan.className = 'tt';
        var topRankTrs = document.createElement('trs');
        topRankTrs.textContent = 'Top Rank';
        titleScoresSpan.appendChild(topRankTrs);
        titleScoresDiv.appendChild(titleScoresSpan);

        var sortedBySpan = document.createElement('span');
        sortedBySpan.className = 'sorted-by';
        sortedBySpan.textContent = 'Sort By PP';
        var barsArrowM = document.createElement('m');
        barsArrowM.className = 'bars-arrow-down white';
        sortedBySpan.appendChild(barsArrowM);
        titleScoresDiv.appendChild(sortedBySpan);

        var listScoreDiv = document.createElement('div');
        listScoreDiv.className = 'list-score';
        scoresListDiv.appendChild(listScoreDiv);


        return pageDiv;
    }
   
    global.renderer = renderer
})(this);