function createNavMenu() {
    const navContainer = document.createElement('div');
    navContainer.classList.add('nav-bottom');
  
    const navMenu = document.createElement('div');
    navMenu.classList.add('nav-menu');
  
    const menuItems = [
      { icon: 'radio-button-off-outline', text: 'Home', id: 'HomePage' },
      { icon: 'chatbubble-ellipses-outline', text: 'Bot IG', id: 'BotIgPage' },
      { icon: 'game-controller-outline', text: 'Gameplay', id: 'GamePlayPage' },
      { icon: 'pulse-outline', text: 'Stats', id: 'StatsPage' },
      { icon: 'receipt-outline', text: 'History', id: 'HistoryPage' },
      { icon: 'terminal-outline', text: 'Prompt Gen.', id: 'PromptGenPage' },
      { icon: 'browsers-outline', text: 'Ref helper', id: 'RefHelperPage', elementId: 'refHelperHandler' },
      { icon: 'copy-outline', text: 'Overlays', id: 'OverlaysPage', active: true, elementId: 'overlays' },
      { icon: 'book-outline', text: 'Doc', id: 'DocPage' },
    ];
  
    menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.classList.add('btn-menu');
      if (item.active) {
        menuItem.classList.add('active');
      }
      if (item.elementId) {
        menuItem.id = item.elementId;
      }
      menuItem.onclick = function () {
        setActiveButton(this);
      };
      menuItem.dataset.id = item.id;
  
      const icon = document.createElement('ion-icon');
      icon.name = item.icon;
  
      const text = document.createElement('span');
      text.textContent = item.text;
  
      const indicator = document.createElement('div');
      indicator.classList.add('indicator');
  
      menuItem.appendChild(icon);
      menuItem.appendChild(text);
      menuItem.appendChild(indicator);
  
      navMenu.appendChild(menuItem);
    });
  
    navContainer.appendChild(navMenu);
  
    return navContainer;
  }
  module.exports = createNavMenu;