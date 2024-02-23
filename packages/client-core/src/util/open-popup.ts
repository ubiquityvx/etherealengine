//Adapted from https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen, based on http://www.xtf.dk/2011/08/center-new-popup-window-even-on.html

export default ({url, title, w, h}) => {
    return new Promise(resolve => {
        // Fixes dual-screen position                             Most browsers      Firefox
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

        let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        const systemZoom = width / window.screen.availWidth;
        const left = (width - w) / 2 / systemZoom + dualScreenLeft
        const top = (height - h) / 2 / systemZoom + dualScreenTop

        const newWindow = window.open(url, title,
            `
      scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
      `
        )

        console.log('newWindow', newWindow)

        function checkWindow() {
            if (newWindow.closed) {
                clearInterval(interval)
                resolve()
            }
        }

        if (window.focus && newWindow) newWindow.focus();

        const interval = setInterval(checkWindow, 500)
    })
}