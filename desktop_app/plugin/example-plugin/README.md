## Plugin Example
How to create your own plugin compatible with Bella Fiora Desktop

### Plugin entry point *(required)*

`pi.js` *(Plug In)*

**Structure of plugin directory**

    └── [app-location]/  
        └── plugins/ //insert your plugin inside 
            └── example-plugin/ 
                ├── assets 
                ├── scripts 
                └── pi.js


### Take into account that the plugin does not have access to all private modules of Bella Fiora.
#### Unsupported:
 - electron 
 - lib/osuFile 
 - lib/error 
 - lib/ini 
 - lib/artisan
 - lib/priv/remote-server
 - lib/local-server
 - lib/priv/credential
 - lib/db_parser
 - lib/osu_utils

Consult the rest of the documentation to see how to exploit some features of these libraries without requiring()


### Plugin Structure: *(required)*

````JS
module.exports  = {
	init: (app) => {
		app.Initialize({
			pluginName:  'example-plugin',
			author:  'Puparia',
			description:  'Descript your plugin here',
			version:  '1.0.0' 
		});
		app.Tab({
			tabName:  'New Tab', //create tab for plugin
			icon:  'balloon-outline'//Icon of the ion-icon library
		})
		async function Plugin() {
			//Insert all the logic of your plugin inside
		}
		Plugin();//Run plugin
	},
};
````
##  API
### `app.Initialize()` *(required)*

 - `pluginName` 
	 - string:[A-Z-a-z] [2-8] chars
 - `author`
	 - string:[A-Z-a-z-0-9] [2-32] chars
 - `description`
	 - string:[A-Z-a-z-0-9] [2-4096] chars
 - `version` 
	 - float: format[xx.xx.xx]

---
### `app.Tab()` *(required)*

 - `tabName`
	 - string:[A-Z-a-z] [2-8] chars
 - `icon`
	 - ion-icon librairies
 
---
### `app.PlayerData(callback)` *(await/async)*
 - Return `callback`
 
**Description**:

Get all the data about the player who connected with Osu. Find the strucure received [here](url).
It runs in callback, wait for the answer

**Example**:
````JS
await app.PlayerData().then(callback  =>{
	(callback) //use player data after app launched
})
````
---
### `app.Osu(callback)` *(await/async)*
 - return `callback`
 
 **Description**:

Retrieve when you want, all data concerning Osu via Gosumemory.
Find the structure received [here](url).
It runs in callback, wait for the answer

**Example**:
````JS
await app.Osu().then(callback  =>{
	(callback) //use Gosumemory data after app launched
})
````
---
### `app.Error()`
 - `error`
	 - string:[A-Z-a-z-0-9] [2-256] chars
 - `exit`
	 - boolean:false/true exit Bella Fiora Desktop 

**Description**:

Display an error to the user. You have the option to force stop all processes related to the application. Specify the reason for the error to the user.

**Example**:
````JS
app.Error({
	error: 'Error content',
	exit: false 
})
````
---
### `app.FatalError()`
 - `error`
	 - string:[A-Z-a-z-0-9] [2-256] chars

**Description**:

Exit the application with a fatal error for the operation of the application. This function stops the entire application process no matter what. Specify the reason for the user.

**Example**:
````JS
app.FatalError({
	error: 'Error content'
})
````
---

### `app.LoadFile(callback)` *(await/async)*

 - Plugin Folder Name
 - Your File
 -  return `callback`

**Description**:

Recover a file in your extension folder.

**Example**:

````JS
await app.LoadFile('example-plugin', '/assets/data.json').then(callback  =>{
    try {
        jsonObject = JSON.parse(callback)
    } catch(e){
        app.Error(e)
    }
})
````
---
 

