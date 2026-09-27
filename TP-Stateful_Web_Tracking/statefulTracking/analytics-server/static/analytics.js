(function() {
    // 1. Check whether an analytics cookie exists
    function getCookie(name) {
        let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
        return null;
    }

    let aid = getCookie('_analytics_id');

    // 2. Generate a random identifier if it does not exist
    if (!aid) {
        aid = 'user_' + Math.random().toString(36).substr(2, 9);
        
        // 3 & 4. Store the identifier using document.cookie and keep it for future visits
        let expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);
        document.cookie = "_analytics_id=" + aid + "; expires=" + expiry.toUTCString() + "; path=/";
    }

    // Collect the user's browsing activity (the current domain)
    let publisher = window.location.hostname;
    
    // Send it to the analytics server using an invisible image pixel
    let trackingPixel = new Image();
    trackingPixel.src = "http://analytics.test:9100/track?publisher=" + encodeURIComponent(publisher) + "&aid=" + encodeURIComponent(aid);
})();
