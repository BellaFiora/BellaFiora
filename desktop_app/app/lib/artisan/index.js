const osutils = require('../Osu_Utils')

class Artisan {
	constructor() {
		this.headSection = [] 
		this.bodySections = [] 
		this.Utils = new osutils()
		this.content = {
			construct : (content) => {
				return this.serialize(content)
			}
		}
	}

	addContentHTML(raw, props = {}) {
		const mergedProps = Object.assign({}, props, this, this.props);
		raw = raw.replace(
			/{(this\.)?props\.(.*?)}/g,
			(match, p1, p2) => mergedProps[p2.trim()]);
		const scriptMatches = raw.match(/\$:([\s\S]*?)\$/g);

		if (scriptMatches) {
			scriptMatches.forEach(scriptTag => {
				const scriptCode = scriptTag.replace(/\$:/, '').replace(/\$$/, '').trim();
				const scriptResult = new Function(`return ${scriptCode}`)();
				raw = raw.replace(scriptTag, scriptResult);
			});
		}

		this.bodySections.push(raw);
		return this;
	}

	scoreElement(score, map, playmode){

		console.log(`${playmode} - ${map.mode}`)
		let contentHTML = `
		<div class="score-container ${(playmode !== map.mode) ? 'hidden' : ''}" data-mode="${map.mode}" data-beatmapId="${map.beatmap_id}" data-beatmapSetId ="${map.beatmapset_id}">
			<div class="score-pp">${(parseFloat(score.pp)).toFixed(0)} PP</div>
			<div class="score-infos">
				<div class="score-container-top">${map.title} - ${map.artist} [${map.version}] By ${map.creator}</div>
				<div class="score-container-bottom">${new Date(score.date).toDateString()} | Accuracy: | Stars: ${(parseFloat(map.difficulty_rating)).toFixed(2)}★</div>
			</div>
			<div class="score-mods">${this.Utils.ModsIntToString(score.enabled_mods)}</div>
			<div class="score-rank">${score.rank}</div>
		</div>
		`
		return contentHTML
	}


	addPage(data){
		
	}
	create(props) {
		this.props = props.props 
		this.local = this.props.lang 
		this.type = props.props.objectType
		return this;
	}
	link(obj) {
		this.props.ressources.links.push({
			href : obj.href ? obj.href : '',
			rel : obj.rel ? obj.rel : '',
			position : obj.position ? obj.position : ''
		})
		return this
	}
	title(obj) {
		this.props.title = obj
		return this
	}
	meta(obj) {
		this.props.meta.viewPort = obj.viewPort ? obj.viewPort : ''
		 this.props.meta.charset = obj.charset ? obj.charset : ''
		return this
	}
	script(obj) {
		this.props.ressources.scripts.push({
			href : obj.href ? obj.href : '',
			defer : obj.defer ? obj.defer : '',
			type : obj.type ? obj.type : '',
			position : obj.position ? obj.position : ''
		})
		return this
	}
	css(obj) {
		this.props.ressources.css.push(obj)
		return this
	}
	build(type, content) {
		return `\n<${type}>\n${content}</${type}>\n`
	}
	async construct() {
		return new Promise((resolve, reject) => {
			let page =
				[ { Head : '', Body : '', End : '' } ] 
				if (this.props.viewPort) {
				page[0].Head += `<meta name="viewport" content="${this.props.viewPort}"/>\n`
			}
			if (this.props.charset) {
				page[0].Head += `<meta charset="${this.props.charset}"/>\n`
			}
			if (this.props.title) {
				page[0].Head += `<title>${this.props.title}</title>\n`
			}
			if (this.props.ressources.scripts) {
				this.props.ressources.scripts.forEach(script => {
					if (script.position === 'Header') {
						page[0].Head += `<script src="${script.href}" ${
							script.nomodule ? 'nomodule' : ''} ${script.defer ? 'defer' : ''} ${
							script.type ? 'type="' + script.type + '"' : ''}></script>\n`
					}
				});
			}

			if (this.props.ressources.css) {
				this.props.ressources.css.forEach(
					obj => { page[0].Head += `<link rel="stylesheet" href="${obj}"/>\n` });
			}

			if (this.props.ressources.links) {
				this.props.ressources.links.forEach(link => {
					if (link.position === 'Header') {
						page[0].Head += `<link rel="${link.rel}" href="${
							link.href}" ${link.cross ? link.cross : ''}>\n`
					}
				});
			}

			page.Head += `</head>`;
			page.Body += `<body>\n`;

			this.bodySections.forEach(section => { page[0].Body += section });

			if (this.props.ressources.scripts) {
				this.props.ressources.scripts.forEach(script => {
					if (script.position === 'endBody') {
						page[0].Body += `<script src="${script.href}" ${
							script.nomodule ? 'nomodule' : ''} ${script.defer ? 'defer' : ''} ${
							script.type ? 'module="' + script.type + '"' : ''}></script>\n`
					}
				});
			}

			page.End += '</body>';

			const document = [
				`\n<!DOCTYPE ${this.props.format}>\n<html lang="${
					this.props.lang}">\n`,
				this.build('head', page[0].Head),
				this.build('body', page[0].Body), `</html>`
			]

			resolve(this.serialize(document.join('\n')));
		})
	}
	serialize(content) {
		return content;
	}
}

module.exports = Artisan