(function (global) {
    function renderer(array) {
        if (!array || typeof array.toggle === 'undefined' || typeof array.link === 'undefined' || typeof array.icon === 'undefined' || typeof array.name === 'undefined' || typeof array.value === 'undefined') {
            return
        }

        let active = array.toggle ? 'active' : '';
        var div = document.createElement('div');
        div.className = `menuBtn navigate-page ${active}`;
        div.setAttribute('target', array.link);
        div.setAttribute('id', `button_${array.name}`)

        var m = document.createElement('m');
        m.className = `white ${array.icon}`;

        var span = document.createElement('span');

        var trs = document.createElement('trs');
        trs.setAttribute('key', array.name);
        trs.textContent = array.value;
        span.appendChild(trs); 

        div.appendChild(m);
        div.appendChild(span);

        return div;
    }
    global.renderer = renderer
    
})(this);