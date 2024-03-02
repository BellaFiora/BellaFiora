"use strict";

class OsuUtils {

	
	/**
	 * Calculate accuracy based on hits and mode.
	 *
	 * @param {number} m - Game mode (0 to 3).
	 * @param {number} h3 - Number of 300s.
	 * @param {number} h1 - Number of 100s.
	 * @param {number} h5 - Number of 50s.
	 * @param {number} h0 - Number of misses.
	 * @param {number} [k=0] - Number of katus (optional, default is 0).
	 * @param {number} [g=0] - Number of geki (optional, default is 0).
	 * @returns {string} - Calculated player acc.
	 * @throws {Error} - Throws an error for invalid game mode.
	 */
	acc(m, h3, h1, h5, h0, k = 0, g = 0) {
		try {
			if (m < 0 || m > 3) {
				throw new Error("Invalid game mode");
			}
			let acc;
			switch (m) {
			case 0:
				acc = (100.0 * (6 * h3 + 2 * h1 + h5)) / (6 * (h5 + h1 + h3 + h0));
				break;
			case 1:
				acc = (100.0 * (2 * h3 + h1)) / (2 * (h3 + h1 + h0));
				break;
			case 2:
				acc = (100.0 * (h3 + h1 + h5)) / (h3 + h1 + h5 + k + h0);
				break;
			case 3:
				acc = (100.0 * (6 * g + 6 * h3 + 4 * k + 2 * h1 + h5)) / (6 * (h5 + h1 + h3 + h0 + g + k));
				break;
			}

			return acc.toFixed(2);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Determine performance rating based on mode, player acc, and hits.
	 *
	 * @param {number} m - Game mode (0 to 3).
	 * @param {number} h3 - Number of 300s.
	 * @param {number} h1 - Number of 100s.
	 * @param {number} h5 - Number of 50s.
	 * @param {number} h0 - Number of misses.
	 * @param {string} [mds=null] - Modifiers (optional, default is null).
	 * @param {number} pAcc - Player's acc.
	 * @returns {string} - Performance rating.
	 */
	note(m, h3, h1, h5, h0, mds = null, pAcc) {
		try {
			switch (m) {
			case 0:
				return this.calculateNoteStandard(pAcc, h3, h1, h5, h0, mds);
			case 1:
				return this.calculateNoteTaiko(pAcc);
			case 2:
				return this.calculateNoteCTB(pAcc);
			case 3:
				return this.calculateNoteMania(pAcc, mds);
			default:
				throw new Error("Invalid game mode");
			}
		} catch (error) {
			throw error;
		}
	}
	/**
	 * Calculate performance rating for standard game modes (0, 1, 2, and 3).
	 *
	 * @param {number} pAcc - Player's acc.
	 * @param {number} h3 - Number of 300s.
	 * @param {number} h1 - Number of 100s.
	 * @param {number} h5 - Number of 50s.
	 * @param {number} h0 - Number of misses.
	 * @param {string} mds - Modifiers.
	 * @returns {string} - Performance rating.
     * @returns {number} - Boat, averge note stacked of 50 percent 1.
	 * @private
	 */
	calculateNoteStandard(pAcc, h3, h1, h5, h0, mds) {
        let th = h3 + h1 + h5 + h0;
        let boat = (h5 / th) * 100;

		if (pAcc === 100) {
			return mds ? 'SSH' : 'SS';
		} else if (pAcc > 90 && boat <= 1 && h0 === 0) {
			return mds ? 'SH' : 'S';
		} else if ((pAcc > 80 && h0 === 0) || pAcc > 90) {
			return 'A';
		} else if ((pAcc > 70 && h0 === 0) || pAcc > 80) {
			return 'B';
		} else if (pAcc > 60) {
			return 'C';
		} else {
			return 'D';
		}
	}
	/**
	 * Calculate performance rating for Taiko mode (1).
	 *
	 * @param {number} pAcc - Player's acc.
	 * @returns {string} - Performance rating.
	 * @private
	 */
	calculateNoteTaiko(pAcc) {
		if (pAcc === 100) {
			return 'SSH';
		} else if (pAcc > 98 && pAcc <= 99.99) {
			return 'SH';
		} else if (pAcc > 94.01 && pAcc <= 98) {
			return 'A';
		} else if (pAcc > 90.01 && pAcc <= 94) {
			return 'B';
		} else if (pAcc > 85.01 && pAcc <= 90) {
			return 'C';
		} else {
			return 'D';
		}
	}
	/**
	 * Calculate performance rating for Catch the Beat mode (2).
	 *
	 * @param {number} pAcc - Player's acc.
	 * @returns {string} - Performance rating.
	 * @private
	 */
	calculateNoteCTB(pAcc) {
		// Implement CTB-specific logic as needed
		// For now, using the same logic as Taiko
		return this.calculateNoteTaiko(pAcc);
	}
	/**
	 * Calculate performance rating for Mania mode (3).
	 *
	 * @param {number} pAcc - Player's acc.
	 * @param {string} mds - Modifiers.
	 * @returns {string} - Performance rating.
	 * @private
	 */
	calculateNoteMania(pAcc, mds) {
		if (pAcc === 100) {
			return mds ? 'SSH' : 'SS';
		} else if (pAcc > 95) {
			return mds ? 'SH' : 'S';
		} else if (pAcc > 90) {
			return 'A';
		} else if (pAcc > 80) {
			return 'B';
		} else if (pAcc > 70) {
			return 'C';
		} else {
			return 'D';
		}
	}



	/**
	 * Converts a timestamp in Microsoft FileTime format to a human-readable date string.
	 * @param {number} ms - Timestamp in Microsoft FileTime format.
	 * @returns {string} - Formatted date string.
	 */
	tsms(ms) {
		try {
			const epochDiff = 11644473600000;
			const timestampUnix = (ms / 10000) - epochDiff;
			const date = new Date(timestampUnix);
			const adjustedYear = date.getUTCFullYear() - 1600;
			date.setUTCFullYear(adjustedYear);
			return date.toLocaleString();
		} catch (error) {
			console.error("Error in tsms function:", error);
			return "Invalid Date";
		}
	}

	/**
	 * Converts a numeric representation of mods to a space-separated string of mod names.
	 * @param {number} int - Numeric representation of mods.
	 * @returns {string} - Space-separated string of mod names.
	 */
	ModsIntToString(int) {
		try {
			const modNames = [];
			const Mods = {
				NF: 1, EZ: 2, HD: 8, HR: 16, SD: 32, DT: 64, RX: 128, HT: 256,
				NC: 512, FL: 1024, SO: 4096, PF: 16384, K4: 32768, K5: 65536,
				K6: 131072, K7: 262144, K8: 524288, FI: 1048576, RD: 2097152,
				TG: 8388608, K9: 16777216, K1: 67108864, K3: 134217728,
				K2: 268435456,
			};
		
			for (let mod in Mods) {
				if (int & Mods[mod]) {
					modNames.push(mod);
				}
			}
			return modNames.join(" ");
		} catch (error) {
			console.error("Error in ModsIntToString function:", error);
			return "Error converting mods";
		}
	}

	/**
	 * Converts a mode string to its corresponding numeric representation.
	 * @param {string} modeString - Mode string ('osu', 'taiko', 'ctb', 'mania').
	 * @returns {number} - Numeric representation of the mode.
	 */
	ModeStringToInt(modeString) {
		try {
			switch (modeString.toLowerCase()) {
				case 'osu':
				case 'osu!':
					return 0;
				case 'taiko':
					return 1;
				case 'ctb':
					return 2;
				case 'mania':
					return 3;
				default:
					return -1;
			}
		} catch (error) {
			console.error("Error in ModeStringToInt function:", error);
			return -1;
		}
	}

}
module.exports = OsuUtils;


