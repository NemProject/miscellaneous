/** @module utils/marketData */

const COINGECKO_XEM_BTC_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=nem&vs_currencies=btc&include_24hr_vol=true&include_24hr_change=true';
const CACHE_KEY = 'nemWalletMarketData:v1:xemBtc';
const CACHE_TTL_MS = 60 * 1000;

/**
 * Reads the cached market data entry, if any.
 *
 * @return {{fetchedAt: number, data: object}|null}
 */
let getCache = function() {
    try {
        let raw = window.localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        let entry = JSON.parse(raw);
        if (!entry || typeof entry.fetchedAt !== 'number' || !entry.data) return null;
        return entry;
    } catch (e) {
        return null;
    }
};

/**
 * Stores a market data entry in the cache.
 *
 * @param {object} data - The market data to cache
 */
let setCache = function(data) {
    try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data: data }));
    } catch (e) {
        /* quota exceeded / private mode: non-fatal, just skip caching */
    }
};

/**
 * Gets XEM/BTC market data from CoinGecko, shaped like the Poloniex
 * BTC_XEM ticker this replaces (highestBid, baseVolume, percentChange
 * as a fraction) so existing consumers don't need to change.
 *
 * Cached for CACHE_TTL_MS to stay within CoinGecko's public API rate
 * limits regardless of how often callers (auto-refresh on connect,
 * manual refresh button) ask for it. On fetch failure, falls back to
 * the last cached value (even if stale) rather than erroring out.
 *
 * @return {Promise} - Resolves with a {highestBid, baseVolume, percentChange} object
 */
let getXemBtcMarketData = function() {
    let cached = getCache();
    if (cached && (Date.now() - cached.fetchedAt) < CACHE_TTL_MS) {
        return Promise.resolve(cached.data);
    }

    return fetch(COINGECKO_XEM_BTC_URL).then((response) => {
        if (!response.ok) {
            throw new Error('CoinGecko request failed with status ' + response.status);
        }
        return response.json();
    }).then((json) => {
        let nemData = json && json.nem;
        if (!nemData || typeof nemData.btc !== 'number') {
            throw new Error('Unexpected CoinGecko response shape');
        }
        let data = {
            highestBid: nemData.btc,
            baseVolume: nemData.btc_24h_vol,
            percentChange: nemData.btc_24h_change / 100
        };
        setCache(data);
        return data;
    }).catch((err) => {
        if (cached) return cached.data;
        throw err;
    });
};

module.exports = {
    getXemBtcMarketData
}
