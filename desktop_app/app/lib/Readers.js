const fs = require('fs');
const uleb128 = require('uleb128');
const Long = require('long');
const { promises: fsPromises } = require('fs');

class OsuDBReader {
	constructor() {
		try {
			this.windowsTickEpoch = Long.fromInt(621355968).multiply(100000);
		} catch (e) {
			console.log(e);
		}
	}

	readString(buf, offset) {
		try {
			if (buf[offset++] !== 11) {
				return { str: '', length: 1 };
			}
			const strlen = uleb128.decode(buf.slice(offset));
			const bytesLen = strlen.length + strlen.value;
			const str = buf.toString(
				'utf-8', offset + strlen.length, offset + bytesLen);

			return { str: str, length: bytesLen + 1 };
		} catch (e) {
			console.log(e);
		}
	}

	createString(str) {
		const strlen128 = uleb128.encode(str.length);
		const strBuf = Buffer.alloc(1 + strlen128.length + str.length);
		strBuf[0] = 0x0b;

		for (let i = 0; i < strlen128.length; i++) {
			strBuf[i + 1] = strlen128[i];
		}

		strBuf.write(str, 1 + strlen128.length);
		return strBuf;
	}

	readLongStr(buf, offset) {
		try {
			const l1 = buf.readInt32LE(offset);
			const l2 = buf.readInt32LE(offset + 4);
			return new Long(l1, l2).toString();
		} catch (e) {
			console.log(e);
		}
	}

	createLongStr(str) {
		const buf = Buffer.alloc(8);
		const l = Long.fromString(str + '');
		buf.writeInt32LE(l.getLowBits(), 0);
		buf.writeInt32LE(l.getHighBits(), 4);
		return buf;
	}

	winTickToMs(num) {
		try {
			const l = Long.fromString(num + '');
			if (l.compare(0) === 0)
				return 0;
			return l.divide(10000).subtract(this.windowsTickEpoch).toString() * 1;
		} catch (e) {
			console.log(e);
		}
	}

	async readOsuDB(osudbPath, md5Array) {
		try {
			let outputCollection = [];
			const buf = await fsPromises.readFile(osudbPath);
			if (!buf) {
				throw new Error('Failed to open osu!.db');
			}
			const version = buf.readInt32LE(0);
			const player = this.readString(buf, 17);
			const beatmapCount = buf.readInt32LE(17 + player.length);
			let offset = 21 + player.length;
			const beatmaps = [];
			for (var i = 0; i < beatmapCount; i++) {
				var beatmap = {};
				var gets1 = [
					'artist', 'artistUnicode', 'title', 'titleUnicode',
					'creator', 'difficulty', 'audioFilename', 'md5', 'osuPath'
				];
				for (var get in gets1) {
					var strobj = this.readString(buf, offset);
					beatmap[gets1[get]] = strobj.str;
					offset += strobj.length;
				}
				offset += 15
				if (version < 20140609) {
					beatmap.AR = buf[offset++];
					beatmap.CS = buf[offset++];
					beatmap.HP = buf[offset++];
					beatmap.OD = buf[offset++];
				} else {
					beatmap.AR = buf.readFloatLE((offset += 4) - 4);
					beatmap.CS = buf.readFloatLE((offset += 4) - 4);
					beatmap.HP = buf.readFloatLE((offset += 4) - 4);
					beatmap.OD = buf.readFloatLE((offset += 4) - 4);
				}

				buf.readDoubleLE((offset += 8) - 8);
				if (version >= 20140609) {
					for (let j = 0; j < 4; j++) {
						var unknownNumCount = buf.readInt32LE((offset += 4) - 4);
						for (let k = 0; k < unknownNumCount; k++) {
							if (buf[offset++] != 0x08)
								throw 'Invalid beatmap!';
							buf.readInt32LE((offset += 4) - 4);
							if (buf[offset++] != 0x0D)
								throw 'Invalid beatmap!';
							buf.readDoubleLE((offset += 8) - 8);
						}
					}
				}
				offset += 12
				let timingPoints = [];
				var timingPointCount = buf.readInt32LE((offset += 4) - 4);
				for (let j = 0; j < timingPointCount; j++) {
					timingPoints[j] = {
						msPerBeat: buf.readDoubleLE((offset += 8) - 8),
						offset: buf.readDoubleLE((offset += 8) - 8),
						inherited: buf[offset++]
					};
				}
				beatmap.beatmapId = buf.readInt32LE((offset += 4) - 4);
				beatmap.beatmapSetId = buf.readInt32LE((offset += 4) - 4);
				offset += 15;
				var source = this.readString(buf, offset);
				offset += source.length;
				var tags = this.readString(buf, offset);
				offset += tags.length;
				buf.readUInt16LE((offset += 2) - 2);
				var font = this.readString(buf, offset);
				offset += font.length;
				buf[offset++];
				this.readLongStr(buf, (offset += 8) - 8);
				this.winTickToMs(beatmap.lastPlayedWindows);
				buf[offset++];
				var beatmapFolder = this.readString(buf, offset);
				offset += beatmapFolder.length;
				beatmap.beatmapFolder = beatmapFolder.str;
				this.readLongStr(buf, (offset += 8) - 8);
				this.winTickToMs(beatmap.lastCheckWindows);
				buf[offset += 5]; 
				if (version < 20140609)
					offset++;
				offset += 5;

				beatmaps.push(beatmap);
				if (md5Array.includes(beatmap.md5)) {
					outputCollection.push(beatmap);
				}
			}

			return outputCollection
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
	async readCollectionDB(collectionDB, osuDB) {
		return new Promise((resolve, reject) => {
			fs.readFile(collectionDB, async (err, buf) => {
				if (err || !buf) {
					console.log('Failed to open collection.db')
					return;
				}
	
				var md5Array = []
				var collections = {};
				var collectionCount = buf.readInt32LE(4);
				var offset = 8;
				for (var i = 0; i < collectionCount; i++) {
					var name = this.readString(buf, offset);
					offset += name.length;
					collections[name.str] = [];
	
					var beatmapCount = buf.readInt32LE(offset);
					offset += 4;
	
					for (let j = 0; j < beatmapCount; j++) {
						var md5 = this.readString(buf, offset);
						offset += md5.length;
						collections[name.str].push(md5.str);
						md5Array.push(md5.str)
	
					}
				}
				let beatmaps = await this.readOsuDB(osuDB, md5Array);
				let beatmapDict = {};
				beatmaps.forEach(beatmap => {
					beatmapDict[beatmap.md5] = beatmap;
				});
	
				let updatedCollections = {};
				for (let collection in collections) {
					updatedCollections[collection] = collections[collection].map(md5 => {
						if (beatmapDict[md5]) {
							return { md5: md5, data: beatmapDict[md5] };
						}
						return { md5: md5 };
					}); 
				}
				resolve(updatedCollections);
			});
		})
		
	}

	writeCollectionDB(path, collections, callback) {
		var buf = new Buffer(8);

		buf.writeInt32LE(20160212);
		buf.writeInt32LE(Object.keys(collections).length, 4);

		for (var name in collections) {
			buf = Buffer.concat([buf, this.createString(name)]);

			var beatmapCountBuf = new Buffer(4);
			beatmapCountBuf.writeInt32LE(collections[name].length);
			buf = Buffer.concat([buf, beatmapCountBuf]);

			for (let j = 0; j < collections[name].length; j++) {
				buf = Buffer.concat(
					[buf, this.createString(collections[name][j])]);
			}
		}

		fs.writeFile(path, buf, callback);
	}

	readScoresDB(path, callback) {
		try {
			fs.readFile(path, (err, buf) => {
				if (err || !buf) {
					console.log('Failed to open scores.db');
					return
				}

				var beatmaps = {};

				var beatmapCount = buf.readInt32LE(4);
				var offset = 8;
				for (let i = 0; i < beatmapCount; i++) {
					var md5 = this.readString(buf, offset);
					if (!beatmaps[md5.str])
						beatmaps[md5.str] = [];
					offset += md5.length;

					var scoreCount = buf.readInt32LE((offset += 4) - 4);

					for (let j = 0; j < scoreCount; j++) {
						var score = {};

						score.mode = buf[offset++];
						score.version = buf.readInt32LE((offset += 4) - 4);

						var gets = ['beatmapMd5', 'player', 'replayMd5'];
						for (var get in gets) {
							var strobj = this.readString(buf, offset);
							score[gets[get]] = strobj.str;
							offset += strobj.length;
						}

						score.c300 = buf.readUInt16LE((offset += 2) - 2);
						score.c100 = buf.readUInt16LE((offset += 2) - 2);
						score.c50 = buf.readUInt16LE((offset += 2) - 2);
						score.cGeki = buf.readUInt16LE((offset += 2) - 2);
						score.cKatu = buf.readUInt16LE((offset += 2) - 2);
						score.cMiss = buf.readUInt16LE((offset += 2) - 2);
						score.replayScore = buf.readInt32LE((offset += 4) - 4);
						score.maxCombo = buf.readUInt16LE((offset += 2) - 2);
						score.perfectCombo = buf[offset++];
						score.mods = buf.readInt32LE((offset += 4) - 4);
						offset += this.readString(buf, offset).length;
						score.timestampWindows = this.readLongStr(buf, (offset += 8) - 8);
						score.timestampMs = this.winTickToMs(score.timestampWindows);
						offset += 4;
						score.onlineScoreId = this.readLongStr(buf, (offset += 8) - 8);
						beatmaps[md5.str].push(score);
					}
				}

				callback(beatmaps);
			});
		} catch (e) {
			console.log(e);
		}
	}
}
module.exports = OsuDBReader;
