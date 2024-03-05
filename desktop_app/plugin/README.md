## Plugin
How to create your own plugin compatible with Bella Fiora Desktop.

### Plugin entry point *(required)*

`pi.js` *(Plug In)*

**Structure of plugin directory**

	└── [app-location]/  
		└── plugins/ //insert your plugin inside 
			└── example-plugin/ 
				├── assets 
				├── scripts 
				├── pi.js
			└── plugin.json


### Take into account that the plugin cannot use requires.

Consult the rest of the documentation to see how to exploit some features of these libraries without require()

### `pi.js` Structure: *(required)*

````JS
module.exports  = {
	void: (app) => {
		app.Tab({
			tabName:  'New Tab', // Create tab for plugin
			icon:  'balloon-outline'// Icon of the ion-icon library
		})
		async function Plugin() {
			// Insert all the logic of your plugin inside
		}
		Plugin(); // Run plugin
	}
};
````

### `plugin.json` Structure: *(required)*

````JSON
{
	"name": "Plugin Name",
	"author": "Puparia",
	"description": "Descript your plugin here",
	"version": "1.0.0'",
	"debug": true
}
````
##  API

### `async app.PlayerData()` 
**Description**:

Get all the data about the player who connected with Osu.

**Returns**:

A Promise that resolves as a [`playerDatas`](#PlayerDatasStruct) struct.

**Example**:
````JS
await app.PlayerData().then(playerDatas => {
	console.log(playerDatas.basic_informations.username);
})
````
---
### `async app.Osu()`
**Description**:

Retrieve all data concerning osu! from tosu.

**Returns**:

A Promise that resolves as a [`tosuInfos`](https://github.com/KotRikD/tosu/wiki/v2-websocket-api-response) struct.

**Example**:
````JS
await app.Osu().then(tosuInfos => {
	console.log(tosuInfos.beatmap.title);
})
````
---
### `app.Error(errorMessage, exit = false)`
**Description**:

Display an error to the user. You have the option to force stop all processes related to the application.

**Example**:
````JS
app.Error('Oh shit critical error', true);
````
---

### `async app.LoadFile(file_path)`
**Returns**:

The file content.

**Example**:
````JS
await app.LoadFile('/assets/data.json').then(content => {
	try {
		jsonObject = JSON.parse(content);
	} catch(e) {
		app.Error(e);
	}
})
````
---

### `async app.WebRequest(url, method, headers = {}, data = null)`
**Description**:

Literally uses
````JS
axios({
	method: method,
	url: url,
	headers: headers,
	data: data
})
````

**Example**:
````JS
await app.WebRequest('https://osu.ppy.sh/u/11103956', 'GET').then(res => {
	if (res.data) {
		console.log(res.data);
	} else {
		app.Error(res.error);
	}
})
````
---
### `app.Renderer()`
**Description**:

Send a message to the renderer of the application.

 - `event-name`
	- string
 - `data`
	- array

**Example**:
````JS
app.Renderer('startPlaying', beatmapArray);
````
---
 
## Structures

### PlayerDatasStruct


**Overall**

````json
{
    "basic_informations": {
        "is_online": "0", //Boolean
        "country": "FR", // Coutry Code
        "username": "Puparia", //String Username
		"userId": "", //INT User ID
        "has_supported": "1", //Boolean
        "is_restricted": "0", //Boolean
        "playmode": "osu", //Default Playmode String osu/taiko/fruits/mania
        "is_bot": "0", //Boolean
        "avatar_url": "", //url 
        "cover_url": "" //url
    },
    "gameplay": {
        "m0": { //Standard statistics
            "levels": [
                {
                    "tech": {}, //View Level struct
                    "speed": {}, //View Level struct
                    "alt": {}, //View Level struct
                    "jump": {} //View Level struct
                }
            ],
            "global_rank": 254068,
            "country_rank": 8902,
            "notes": {
                "ssh": 0,
                "ss": 3,
                "sh": 0,
                "s": 395,
                "a": 403
            },
            "accuracy": 93.9439,
            "plays_count": 23646,
            "total_score": 15553117119,
            "ranked_score": 3944515133,
            "clicks": 4057727,
            "combo_max": 1534,
            "music_gender": [],
            "top_rank": [], //View toprank history struct
            "level": {
                "current": 98,
                "progress": 58
            },
            "exp": 0,
            "pp": 2769.95,
            "history": [], //View history struct
            "rank_history": [], //View Rank history struct
        },
        "m1": {
            "levels": [
                {
                    "tech": {},
                    "speed": {},
                    "alt": {},
                    "jump": {}
                }
            ],
            "global_rank": null,
            "country_rank": null,
            "notes": {
                "ssh": 0,
                "ss": 0,
                "sh": 0,
                "s": 1,
                "a": 2
            },
            "accuracy": 88.6269,
            "plays_count": 29,
            "total_score": 9408252,
            "clicks": 16354,
            "combo_max": 461,
            "music_gender": [],
            "top_rank": [],
            "level": {
                "current": 10,
                "progress": 37
            },
            "exp": 0,
            "pp": 0,
            "history": [],
            "rank_history": [],
            "ranked_score": 3690771,
            "history_rank": []
        },
        "m3": {
            "levels": [
                {
                    "tech": {},
                    "speed": {},
                    "alt": {},
                    "jump": {}
                }
            ],
            "global_rank": 23615,
            "country_rank": 373,
            "notes": {
                "ssh": 3,
                "ss": 352,
                "sh": 45,
                "s": 1613,
                "a": 291
            },
            "accuracy": 95.8085,
            "plays_count": 26568,
            "total_score": 10967747962,
            "clicks": 21357858,
            "combo_max": 4801,
            "music_gender": [],
            "top_rank": [], 
            "level": {
                "current": 97,
                "progress": 48
            },
            "exp": 0,
            "pp": 4859.83,
            "history": [],
            "rank_history": [],
            "ranked_score": 2190428950,
            "history_rank": []
        }
    },
    "maps": [] //View maps struct
}
````

**Rank history**

````json
  "history_rank": [
    263003,
    263087,
    263151,
    263250,
    // ... of 90 values..
]
````

**Top Rank history**

````json
{
    "beatmap_id": "1067123",
    "score_id": "4520873114",
    "score": "2729699",
    "maxcombo": "360",
    "count50": "0",
    "count100": "29",
    "count300": "258",
    "countmiss": "0",
    "countkatu": "14",
    "countgeki": "38",
    "perfect": "0",
    "enabled_mods": "64",
    "user_id": "5146531",
    "date": "2023-10-13 21:12:06",
    "rank": "A",
    "pp": "154.968",
    "replay_available": "0"
},
//... And all tops ranks
````

**Levels**
````json
"tech": {
  "s1": 0, //For star rating 1
  "s3": 0, //..
  "s4": 0,
  "s5": 0,
  "s6": 0,
  "s7": 0,
  "s8": 0,
  "s9": 0,
  "s10": 0
},
"speed": {
  "s1": 0,
  "s3": 0,
  "s4": 0,
  "s5": 0,
  "s6": 0,
  "s7": 0,
  "s8": 0,
  "s9": 0,
  "s10": 0
},
"alt": {
  "s1": 0,
  "s3": 0,
  "s4": 0,
  "s5": 0,
  "s6": 0,
  "s7": 0,
  "s8": 0,
  "s9": 0,
  "s10": 0
},
"jump": {
  "s1": 0,
  "s3": 0,
  "s4": 0,
  "s5": 0,
  "s6": 0,
  "s7": 0,
  "s8": 0,
  "s9": 0,
  "s10": 0
}
````

**Map**
````json
//Basic beatmap structure

"m110656": { //m+beatmap_id
	"id": 2,
	"beatmap_id": 110656,
	"beatmapset_id": 33119,
	"difficulty_rating": "1.98",
	"mode": "osu",
	"status": "ranked",
	"total_length": 203,
	"user_id": 672931,
	"version": "Normal",
	"accuracy": 3,
	"ar": 4,
	"bpm": "150.00",
	"is_convert": null,
	"count_circles": 149,
	"count_sliders": 106,
	"count_spinners": 3,
	"cs": 3,
	"deleted_at": "2024-02-23T00:09:48.000Z",
	"drain": 3,
	"hit_length": 186,
	"is_scoreable": true,
	"last_updated": "2014-05-18T17:22:13.000Z",
	"mode_int": 0,
	"passcount": 345844,
	"playcount": 658264,
	"ranked": 1,
	"url": "https://osu.ppy.sh/beatmaps/110656",
	"checksum": "ad5f2a85919c325b14404a7566cd9e58",
	"max_combo": 412,
	"artist": "F-777",
	"artist_unicode": "F-777",
	"creator": "TicClick",
	"nsfw": false,
	"offset": 0,
	"play_count": 2539710,
	"preview_url": null,
	"spotlight": false,
	"title": "He's a Pirate",
	"title_unicode": "He's a Pirate",
	"video": false,
	"can_be_hyped": false,
	"ranked_date": "2012-03-20T06:20:35.000Z",
	"storyboard": false,
	"submitted_date": "2011-07-10T13:19:59.000Z",
	"tags": "newgrounds hans zimmer klaus badelt pirates of the caribbean hacksl heatkai jesse valentine featured artist"
},
//.. And all maps of top ranks
````


...
