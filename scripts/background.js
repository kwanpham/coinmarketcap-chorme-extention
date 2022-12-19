var websocket;
var port = chrome.runtime.connect({ name: "stock" });
let urlSocket = 'wss://stream.coinmarketcap.com/price/latest';
chrome.storage.local.get(["badgeText"], ({ badgeText }) => {
  chrome.action.setBadgeText({ text: badgeText });
});


connect(urlSocket);

//Make a websocket connection with the server.
function connect(host) {
  if (websocket === undefined || websocket == null || websocket.readyState === websocket.CLOSED) {
    // port.postMessage("open");
    websocket = new WebSocket(host);
  }

  websocket.onopen = function () {
    websocket.send(
      '{"method":"subscribe","id":"price","data":{"cryptoIds":[1,1027,1839,52,5994],"index":null}}'
    );
  };

  websocket.onmessage = function (event) {
    console.log(event.data);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length === 0) {
        return;
      }
      chrome.tabs.sendMessage(tabs[0].id, event.data, function (response) {});
    });
  };

  //If the websocket is closed but the session is still active, create new connection again
  websocket.onclose = function () {
    // port.postMessage("close");
    connect(urlSocket);
  };
}
