const COINGECKO_XEM_BTC_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=nem&vs_currencies=btc&include_24hr_vol=true&include_24hr_change=true';

/** Service fetching XEM/BTC market data from CoinGecko. */
class MarketData {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor($localStorage) {
        'ngInject';

        //// Service dependencies region ////

        this._storage = $localStorage;

        //// End dependencies region ////
    }

    //// Service methods region ////

    /**
     * Gets XEM/BTC market data from CoinGecko, shaped like the Poloniex
     * BTC_XEM ticker this replaces (highestBid, baseVolume, percentChange
     * as a fraction) so existing consumers don't need to change.
     *
     * On fetch failure, falls back to the last successfully fetched value
     * (even if stale), rather than erroring out, if one is available.
     *
     * @return {Promise} - Resolves with a {highestBid, baseVolume, percentChange} object
     */
    getXemBtcMarketData() {
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
            this._storage.xemBtcMarketData = data;
            return data;
        }).catch((err) => {
            if (this._storage.xemBtcMarketData) return this._storage.xemBtcMarketData;
            throw err;
        });
    }

    //// End methods region ////

}

export default MarketData;
