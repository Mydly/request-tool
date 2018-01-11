const path = require('path');

// export const HttpHost = 'ming.a.com';  //dev
const HttpHost = 'http://blockchain.bic-coin.com';  //dis

const prefix  = "Move";
const safePwd = "Movesay47usxhdq3wjkl";
const appTitle = "动说钱包";
const defaultCoin = "bic";
const requestInterval = 8000;

const config = {
    safePwd:safePwd,
    host:HttpHost,
    prefix:prefix,
    appTitle:appTitle,
    defaultCoin:defaultCoin,
    requestInterval:requestInterval
}

module.exports = config;


