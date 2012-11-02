
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
		alert("get:"+request.greeting);
        if (request.greeting == "hello")
        {
            var c = new Object();
            c.Y = window.scrollY;
            c.url = document.URL;
            c.title = document.title;
            sendResponse( JSON.stringify(c) );
        }
    });
