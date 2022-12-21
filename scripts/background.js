var websocket;
//var port = chrome.runtime.connect({ name: "stock" });
let urlSocket = 'wss://stream.coinmarketcap.com/price/latest';
// chrome.storage.local.get(["badgeText"], ({ badgeText }) => {
//   chrome.action.setBadgeText({ text: badgeText });
// });


connect(urlSocket);

//Make a websocket connection with the server.
function connect(host) {
  if (websocket === undefined || websocket == null || websocket.readyState === websocket.CLOSED) {
    // port.postMessage("open");
    websocket = new WebSocket(host);
  }

  websocket.onopen = function () {

    chrome.storage.sync.get(["money_map"]).then((result) => {
      if (result === undefined || result == null || result.money_map == null || Object.keys(result.money_map).length === 0) {

      } else {
        let arrayMoney = JSON.parse(result.money_map).map(item => item.key).join(",");
        console.log(arrayMoney);
        websocket.send(
            '{"method":"subscribe","id":"price","data":{"cryptoIds":['+arrayMoney+'],"index":null}}'
        )
      }
    })



  };

  websocket.onmessage = async function (event) {
   // console.log(event.data);
    // port.postMessage(event.data);


    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   if (tabs.length === 0) {
    //     return;
    //   }
    //   chrome.tabs.sendMessage(tabs[0].id, event.data, function (response) {});
    // });

    let currentTab = await getCurrentTab();
    if (currentTab !== undefined) {
      chrome.tabs.sendMessage(currentTab.id, event.data, null, function (response) {});
    }

   // chrome.tabs.sendMessage(currentTab.id, event.data, function (response) {});
  };

  //If the websocket is closed but the session is still active, create new connection again
  websocket.onclose = function () {
    // port.postMessage("close");
    connect(urlSocket);
  };
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}