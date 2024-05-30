class VerticalBar{
    constructor(){
        this.toggle = 'home';
        this.navigate_holder = document.getElementById('navigate_place')
        this.navigate_holder_other = document.getElementById('other_place')
        this.menu = [
            {
                name: 'home',
                link: 'home_page',
                disabled: false,
                toggle: true,
                icon: 'home',
                value: 'Home',
                other: false
            },
            {
                name: 'gameplay',
                link: 'gameplay_page',
                disabled: false,
                toggle: false,
                icon: 'cursor-arrow-rays',
                value: 'Gameplay',
                other: false
            },
            {
                name: 'player',
                link: 'player_page',
                disabled: true,
                toggle: false,
                icon: 'play',
                value: 'Player',
                other: false
            },
            {
                name: 'bot',
                link: 'bot_page',
                disabled: true,
                toggle: false,
                icon: 'chevron-double-right', 
                value: 'Bot',
                other: false
            },
            {
                name: 'collections',
                link: 'collections_page',
                disabled: false,
                toggle: false,
                icon: 'star',        
                value: 'Collections',
                other: false
            },
            {
                name: 'lobby',
                link: 'lobby_page',
                disabled: true,
                toggle: false,
                icon: 'table-cells',
                value: 'Lobby',
                other: false
            },
            {
                name: 'statistics',
                link: 'statistics_page',
                disabled: true,
                toggle: false,
                icon: 'presentation-chart-line',   
                value: 'Stats',
                other: false
            },  
            {
                name: 'chatbot',
                link: 'chatbot_page',
                disabled: false,
                toggle: false,
                icon: 'lifebuoy',        
                value: 'Chabot IA',
                other: false
            },
            {
                name: 'spectacle',
                link: 'spectacle_page',
                disabled: false,
                toggle: false,
                icon: 'video-camera-slash',   
                value: 'Spectacle',
                other: false
            },
            {
                name: 'settings',
                link: 'settings_page',
                disabled: false,
                toggle: false,
                icon: 'cog',   
                value: 'Settings',
                other: true
            }
        ];
    }

    async init(){
        let navigate_button = await func('../lib/gui/structs/navigate_button.js', function() { return renderer});
        this.menu.forEach(item => {
            var buttonElement = navigate_button(item);
            buttonElement.addEventListener('click', () => { this.switch(item)});
            item.other ? this.navigate_holder_other.appendChild(buttonElement) : this.navigate_holder.appendChild(buttonElement)
        });
    }

    switch(item){
        
        let current_toggle = this.menu.find(current_item => current_item.name === this.toggle);
        this.toggle = item.name
        document.getElementById(`button_${current_toggle.name}`).classList.remove('active')
        document.getElementById(`button_${item.name}`).classList.add('active')
        // document.getElementById(current_toggle.link).classList.add('no-toggle')
        // document.getElementById(item.link).classList.remove('no-toggle')
        let pages = new Pages()
        pages.loadPage(item.link)
  
        

    }
}
