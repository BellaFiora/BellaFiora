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

A Promise that resolves as a [`tosuInfos`](	t-api-response) struct.

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

### PlayerDatasStruct {#PlayerDatasStruct}

...
