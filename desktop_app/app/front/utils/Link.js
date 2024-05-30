const OsuUtils = require('../../lib/Osu_Utils')
const { shell } = require('electron');
let osuUtils = new OsuUtils()

async function Link(event, url){
    switch(event){
        case'CopyLink':
        let element = document.getElementById('shareBtn')
        let beatmapId = element.getAttribute('data-beatmapId')
        let beatmapsetId = element.getAttribute('data-beatmapsetId')
        let mode = element.getAttribute('data-gamemode')
        if(beatmapsetId === "-1"){
            showNotificationBox('This beatmap is not published', "info")
        } else {
            await navigator.clipboard.writeText(`https://osu.ppy.sh/beatmapsets/${beatmapsetId}#${osuUtils.ModeIntToString(mode)}/${beatmapId}`);
            showNotificationBox('Link copied', "info")
        }
        break;
        case 'OpenBrowser':
            let nelement = document.getElementById('shareBtn')
            let nbeatmapId = nelement.getAttribute('data-beatmapId')
            let nbeatmapsetId = nelement.getAttribute('data-beatmapsetId')
            let nmode = nelement.getAttribute('data-gamemode')

        if(nbeatmapsetId === "-1"){
            showNotificationBox('This beatmap is not published', "info")
        } else {
            shell.openExternal(`https://osu.ppy.sh/beatmapsets/${nbeatmapsetId}#${osuUtils.ModeIntToString(nmode)}/${nbeatmapId}`); 
        } 
        break;
        case 'openBrowser': 
        shell.openExternal(`${url}`); 
    }
}

module.exports.Link = Link