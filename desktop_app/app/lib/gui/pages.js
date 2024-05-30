class Pages{
    constructor(defaultPage){
        this.defaultPage = defaultPage
        this.mainContent = document.getElementById('main-content')
        this.background = function(page_link){
            if(page_link !== 'gameplay_page'){
                this.mainContent.classList.add('nocolor')
            } else {
                this.mainContent.classList.remove('nocolor')
            }
        }
    }

    async loadDefaultPage(){
        let defaultPage = this.defaultPage;
        this.background(defaultPage)
        let html_renderer = await func(`../lib/gui/structs/${defaultPage}.js`, function() { return renderer}); 
        this.mainContent.appendChild(html_renderer({})) 
    }

    async loadPage(link){
        this.mainContent.innerHTML = null
        this.background(link)
        let html_renderer = await func(`../lib/gui/structs/${link}.js`, function() { return renderer});
        this.mainContent.appendChild(html_renderer({})) 
    }  
}