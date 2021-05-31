var wsUri = "wss://stream.coinmarketcap.com/price/latest";
var output;
var g = document.createElement("div");
g.setAttribute("id", "output");
g.style = "position: fixed; top: 0; right: 0; z-index:9999";
output = document.getElementById("output");
document.body.appendChild(g);

var port = chrome.runtime.connect({ name: "stock" });

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("alertButton").addEventListener("click", function () {
    port.onMessage.addListener(function (msg) {
      console.log(msg); // doesn't log anything
    });
  });
});

function writeToScreen(message) {
  let obj = JSON.parse(message);
  let id = obj.d.cr.id;
  let price = obj.d.cr.p;
  let p7d = obj.d.cr.p7d;
  let p24h = obj.d.cr.p24h;

  let item = document.getElementById(id);

  item.getElementsByClassName("gia")[0].innerHTML = price;
  item.getElementsByClassName("7d")[0].innerHTML = p7d;
  item.getElementsByClassName("24h")[0].innerHTML = p24h;
}

var websocket;

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
var port = chrome.runtime.connect({ name: "stock" });
function createWebSocketConnection() {
  if ("WebSocket" in window) {
    connect("wss://stream.coinmarketcap.com/price/latest");
  }
}

//Make a websocket connection with the server.
function connect(host) {
  if (websocket === undefined) {
    // port.postMessage("open");
    websocket = new WebSocket(host);
  }

  websocket.onopen = function () {
    websocket.send(
      '{"method":"subscribe","id":"price","data":{"cryptoIds":[1,1027,1839,74],"index":null}}'
    );
  };

  websocket.onmessage = function (event) {
    //console.log(event.data);

    writeToScreen(event.data);
  };

  websocket.onclose = function () {
    websocket = undefined;
    chrome.storage.local.get(["demo_session"], function (data) {
      if (data.demo_session) {
        createWebSocketConnection();
      }
    });
  };
}

//Close the websocket connection
function closeWebSocketConnection(username) {
  if (websocket != null || websocket != undefined) {
    websocket.close();
    websocket = undefined;
  }
  e;
}

createWebSocketConnection();
fetch(chrome.runtime.getURL("/template.html"))
  .then((r) => r.text())
  .then((html) => {
    g.insertAdjacentHTML("beforeend", html);
    // not using innerHTML as it would break js event listeners of the page
  });
