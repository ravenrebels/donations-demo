# Paywall/donations using Ravencoin demo

The purpose of this software is to show the basics of setting up a Paywall using Ravencoin.
The code is intentionally naive to make it easy to understand.
"Something", in this case a web page should behave diffently depending on if people have donated or not.

In this demo, for every RVN that is donated the page is open for one minute.
Very short time, yes. Otherwise if would not be possible to demo.
You cant demonstrate that an application has two states if it is always in state one.

## Live demo
https://donations-demo.ting.finance/

## How to install
- Clone the git repo. 
- Mandatory, server.js, change **ravencoinAddress**, optional, change **port**
```
const express = require('express');
const app = express();
const port = 80;

const ravencoinAddress = "RCNAqdWHuQ2GeMWNCWKzp6snUxj6sb3jBN";
app.use(express.static('gui'))
```
- ```npm install```

### How to run
```
npm start
```
## Subscription model vs Donations model

If user X can consume service Y because she has paid, then she has bought something, perhaps a subscriptions.
That would not be considered a donation.

Donations should be general, right?

- An online journalist might be dependent on donations, as long as people donate, the journalist can continue to do her job.
- Bob runs a useful web site. Bob can continue host/run this web site as long as donations are coming in.

## Other uses cases

The technical idea is the same, you can create subscriptions models or "pay to use".
 - Pay to read an article
 - Montly subscription to an online service
