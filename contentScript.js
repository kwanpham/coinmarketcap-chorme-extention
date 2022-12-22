// var port = chrome.runtime.connect({ name: "stock" });
initHtml();

function initHtml() {
    let g = document.createElement("div");
    g.style = "position: fixed; top: 0; right: 0; z-index:9999";

    // fetch(chrome.runtime.getURL("html/template.html"))
    //     .then((r) => r.text())
    //     .then((html) => {
    //         g.insertAdjacentHTML("afterend", html);
    //         // not using innerHTML as it would break js event listeners of the page
    //     });

    let isOpenDrawer = false;
    $.get(chrome.runtime.getURL('html/template.html'), function (data) {
        $(data).appendTo(g);
        document.body.appendChild(g);

        chrome.storage.sync.get(["money_map"]).then((result) => {
            if (result === undefined || result == null || result.money_map == null || Object.keys(result.money_map).length === 0) {

            } else {
                updateTableHTML(JSON.parse(result.money_map));
            }
        })


        $('#menu').click(function (event) {

            if (isOpenDrawer) {
                $("#menu").css("right", "-256px");
                isOpenDrawer = false;
            } else {
                $(this).css("right", "0");
                event.stopPropagation();
                isOpenDrawer = true;
            }


        });

    });
}

function updateTableHTML(myArray) {
    let tableBody = document.getElementById("your-table-body-id2");

    // Reset the table
    tableBody.innerHTML = "";

    // Build the new table
    myArray.forEach(function(object) {
        let newRow = document.createElement("tr");
        newRow.setAttribute("id", object.key);
        tableBody.appendChild(newRow);

        let newCell1 = document.createElement("td");
        newCell1.textContent = myArray.indexOf(object) + 1;
        newRow.appendChild(newCell1);

        let newCell2 = document.createElement("td");
        newCell2.textContent = object.value
        newRow.appendChild(newCell2);

        let newCell3 = document.createElement("td");
        newCell3.setAttribute("class" , "gia")
        newRow.appendChild(newCell3);

        let newCell4 = document.createElement("td");
        newCell4.setAttribute("class" , "24h")
        newRow.appendChild(newCell4);
    });
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    writeToScreen(request);
    sendResponse({});
    return true;
});

// window.addEventListener('DOMContentLoaded', (event) => {
//     console.log(event);
//     document.getElementById('menu').addEventListener('click', function(e) {
//         console.log('Click happened for: ' + e.target.id);
//     });
//
// });

//
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === 'COUNT') {
//     console.log(`Current count is ${request.payload.count}`);
//   }
//
//   // Send an empty response
//   // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
//   sendResponse({});
//   return true;
// });



function writeToScreen(message) {
    let obj = JSON.parse(message);
    let id = obj.d.cr.id;
    let price = obj.d.cr.p;
    // let p7d = obj.d.cr.p7d;
    let p24h = obj.d.cr.p24h;

    let item = document.getElementById(id);

    item.getElementsByClassName("gia")[0].innerHTML = (Math.round(price * 100) / 100).toFixed(2);
    // item.getElementsByClassName("7d")[0].innerHTML = (Math.round(p7d * 100) / 100).toFixed(2);

    if (p24h !== undefined)
        item.getElementsByClassName("24h")[0].innerHTML = (Math.round(p24h * 100) / 100).toFixed(2);
}

