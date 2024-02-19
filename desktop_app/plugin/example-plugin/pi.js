module.exports = {
    //init plugin
    init: (app) => {
      app.Initialize({ 
        pluginName: 'Plugin Name',
        author: 'Puparia',
        description: 'Descript your plugin here',
        version: '1.0.0' //version of plugin
      });
      //Create the plugin tab in the UI navigation bar
      app.Tab({
        tabName: 'New Tab', //create tab for plugin
        icon: 'balloon-outline'//Icon of the ion-icon library
      })

      async function Plugin() {
        await app.PlayerData().then(callback =>{
          (callback) 
        })
      }
      Plugin();//Run plugin
    
    },
  };
  