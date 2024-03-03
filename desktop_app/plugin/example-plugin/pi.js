module.exports = {
    void: async (app) => {
      //Create the plugin tab in the UI navigation bar
      // app.OpenLog()
      app.Tab({
        tabName: 'New Tab', //create tab for plugin
        icon: 'balloon-outline'//Icon of the ion-icon library
      })

      async function Plugin() {
        await app.PlayerData().then(callback =>{
          // .. 
        })
      }
      Plugin();//Run plugin
    
    },
  };
  