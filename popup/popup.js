let moneyList =
    [
        {
            "text": "Bitcoin",
            "value": "1",
            "selected": true
        },
        {
            "text": "Ethereum",
            "value": "1027"

        },
        {
            "text": "Dogecoin",
            "value": "74"
        },
        {
            "text": "Binance",
            "value": "1839"
        }
    ];

let selectBox = document.getElementById('money');
let btnChoose = document.getElementById('btn_choose');

// chrome.storage.sync.set({ "money_map" : null }).then(() => {
//
// });

chrome.storage.sync.get(["money_map"]).then((result) => {
    if (result === undefined || result == null || result.money_map == null || Object.keys(result.money_map).length === 0) {

    } else {
        updateTableHTML(JSON.parse(result.money_map));
    }
})

btnChoose.addEventListener('click', function (e) {
    let value = selectBox.options[selectBox.selectedIndex].value;
    let text = selectBox.options[selectBox.selectedIndex].text;


    chrome.storage.sync.get(["money_map"]).then((result) => {
        console.log(result);

        let arrayMoney;
        if (result === undefined || result == null || result.money_map == null || Object.keys(result.money_map).length === 0) {
            arrayMoney = [];
        } else {
            arrayMoney = JSON.parse(result.money_map);
        }



        for (let  i = 0 ; i < arrayMoney.length ; i++) {
            console.log(arrayMoney[i].key);
            if (arrayMoney[i].key === value) {
                document.getElementById('chatText').value = 'Da ton tại ' + value;
                return;
            }
        }
        let object = {
            key: value,
            value: text
        };
        arrayMoney.push(object);



        chrome.storage.sync.set({ "money_map" : JSON.stringify(arrayMoney) }).then(() => {
            document.getElementById('chatText').value = 'Add success: ' + value;
            updateTableHTML(arrayMoney);
        });

    });



});




for (let i = 0, l = moneyList.length; i < l; i++) {
    let option = moneyList[i];
    selectBox.options.add(new Option(option.text, option.value, option.selected));
}

function updateTableHTML(myArray) {
    let tableBody = document.getElementById("your-table-body-id");

    // Reset the table
    tableBody.innerHTML = "";

    // Build the new table
    myArray.forEach(function(object) {
        let newRow = document.createElement("tr");
        tableBody.appendChild(newRow);

        let newCell1 = document.createElement("td");
        newCell1.textContent = object.value;
        newRow.appendChild(newCell1);

        let newCell2 = document.createElement("td");
        newCell2.textContent = object.key;
        newRow.appendChild(newCell2);

        let newCell3 = document.createElement("td");
        let button = document.createElement('button');
        button.innerHTML = 'Delete item ';
        button.onclick = function(){
            myArray = myArray.filter(function(el) { return el.key !== object.key });
            updateTableHTML(myArray);
            chrome.storage.sync.set({ "money_map" : JSON.stringify(myArray) }).then(() => {
                document.getElementById('chatText').value = 'Delete success : ' + object.value;
            });
        };
        newCell3.appendChild(button);
        newRow.appendChild(newCell3);

    });
}

