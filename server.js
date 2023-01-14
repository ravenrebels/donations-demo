const express = require('express');
const app = express();
const port = 80;

const ravencoinAddress = "RCNAqdWHuQ2GeMWNCWKzp6snUxj6sb3jBN";
app.use(express.static('gui'))
const MINUTE = 60 * 1000;
app.use(express.json());


const transactionsCache = {};
app.get("/status", async function (request, response) {
    //Fetch transactions for address
    const method = "getaddresstxids";
    const params = [ravencoinAddress];


    let hasMempoolTransaction = false;
    const transactionIds = await rpc(method, params);
    const transactions = [];


    //Add transactions from the mempool even though they are not super safe
    const mempool = await rpc("getrawmempool");
    for (const id of mempool) {
        const trans = await rpc("getrawtransaction", [id, true]);
        if (JSON.stringify(trans.vout).indexOf(ravencoinAddress) > -1) {
            trans.time = new Date().getTime() / 1000;
            transactions.push(trans);
            hasMempoolTransaction = true;
        }

    }

    for (const id of transactionIds) {
        if (!transactionsCache[id]) {
            const trans = await rpc("getrawtransaction", [id, true]);
            transactionsCache[id] = trans;
        }
        const trans = transactionsCache[id];
        trans.displayTime = new Date(trans.time * 1000).toLocaleString();
        transactions.push(trans);
    }

    //Sort transactions by date
    transactions.sort((t1, t2) => {
        if (t1.time > t2.time) {
            return 1;
        }
        if (t2.time > t1.time) {
            return -1;
        }
        return 0;
    });

    let serviceEndDate = new Date();
    serviceEndDate.setFullYear(1970);
    transactions.map(transaction => {
        transaction.vout.map(vout => {
            if (vout.scriptPubKey.addresses.includes(ravencoinAddress) === true) {
                const value = vout.value;
                if (vout.value > 0) {
                    if (serviceEndDate > new Date()) {
                        serviceEndDate = new Date(serviceEndDate.getTime() + value * MINUTE);
                    }
                    else {
                        serviceEndDate = new Date(new Date(transaction.time * 1000).getTime() + value * MINUTE);
                    }
                }
            }
        });

    });

    response.send({ serviceEndDate, hasMempoolTransaction });


});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

async function rpc(method, params = []) {
    const data = { method, params };
    const URL = 'https://rvn-rpc-mainnet.ting.finance/rpc'; //replace with your endpoint
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    const obj = await response.json(); // parses JSON response into native JavaScript objects 

    return obj.result;
} 
