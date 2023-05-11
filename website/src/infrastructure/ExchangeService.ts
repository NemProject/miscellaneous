/*
 * Copyright 2021 NEM (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */

import axios from 'axios';
import { ExchangeInfo, MarketData, ExchangeConfig } from 'src/models/Exchange';
import { Config, exchanges } from 'src/config';
import { Utils } from 'src/utils';

interface CoingeckoMarketData {
    base: string;
    bid_ask_spread_percentage: number;
    coin_id: string;
    converted_last: {
        btc: number;
        eth: number;
        usd: number;
    };
    converted_volume: {
        btc: number;
        eth: number;
        usd: number;
    };
    is_anomaly: boolean;
    is_stale: boolean;
    last: number;
    last_fetch_at: string;
    last_traded_at: string;
    market: {
        name: string;
        identifier: string;
        has_trading_incentive: boolean;
    };
    has_trading_incentive: boolean;
    identifier: string;
    name: string;
    target: string;
    target_coin_id: string;
    timestamp: string;
    token_info_url: null;
    trade_url: string;
    trust_score: string;
    volume: number;
}

interface CoincdxMarketData {
    market: string;
    last_price: string;
    volume: string;
}

interface LiquidMarketData {
    last_traded_price: string;
    volume_24h: string;
}

interface ProbitMarketData {
    last: string;
    quote_volume: string;
}

interface ValrMarketData {
    lastTradedPrice: string;
}

interface ZtMarketData {
    symbol: string;
    last: string;
    vol: string;
}

export class ExchangeService {
    // Returns exchange list
    static async getExchangeList(): Promise<ExchangeInfo[]> {
        const exchangeList: ExchangeConfig[] = exchanges;
        const response = await axios.get(Config.URL_MARKET_DATA);
        const targetPriority = [...Utils.getUSDTickers(), 'BTC', 'ETH'];
        const targetOrderIndexes: Record<string, number> = {};

        for (let index = 0; index < targetPriority.length; index++) {
            targetOrderIndexes[targetPriority[index]] = index;
        }

        const exchangeInfoListFromCoingecko: ExchangeInfo[] =
            response.data.tickers
                .map((ticker: CoingeckoMarketData) => ({
                    isUSD: Utils.isUSDTicker(ticker.target),
                    target: ticker.target,
                    exchangeId: ticker.market.identifier,
                    exchangeName: ticker.market.name,
                    price: ticker.last,
                    volume: ticker.converted_volume.usd,
                    url: ticker.trade_url,
                    imageSrc: '',
                }))
                .sort((a: ExchangeInfo, b: ExchangeInfo) => {
                    if (a.exchangeId < b.exchangeId) {
                        return -1;
                    }
                    if (a.exchangeId > b.exchangeId) {
                        return 1;
                    }
                    if (targetOrderIndexes[a.target as string] === undefined) {
                        return 1;
                    }
                    if (targetOrderIndexes[b.target as string] === undefined) {
                        return -1;
                    }
                    return (
                        targetOrderIndexes[a.target as string] -
                            targetOrderIndexes[b.target as string] || 0
                    );
                });

        let currentExchangeId;
        const exchangeInfoListFromCoingeckoFiltered: ExchangeInfo[] = [];
        const exchangeListWithMarketData: ExchangeInfo[] = [];

        for (const ticker of exchangeInfoListFromCoingecko) {
            if (currentExchangeId !== ticker.exchangeId) {
                exchangeInfoListFromCoingeckoFiltered.push(ticker);
                currentExchangeId = ticker.exchangeId;
            }
        }

        for (const exchange of exchangeList) {
            let marketData;

            switch (exchange.exchangeId) {
                case 'coindcx':
                    marketData = await this.getCoindcxInfo();
                    break;

                case 'liquid':
                    marketData = await this.getLiquidInfo();
                    break;

                case 'probit':
                    marketData = await this.getProbitInfo();
                    break;

                case 'valr':
                    marketData = await this.getValrInfo();
                    break;

                case 'zt':
                    marketData = await this.getZtInfo();
                    break;

                default:
                    marketData = exchangeInfoListFromCoingeckoFiltered.find(
                        (ex) => ex.exchangeId === exchange.exchangeId,
                    );
            }

            exchangeListWithMarketData.push({
                ...(marketData || {}),
                ...exchange,
            });
        }

        return exchangeListWithMarketData;
    }

    static async getCoindcxInfo(): Promise<MarketData | null> {
        const url = 'https://api.coindcx.com/exchange/ticker';
        const exchangeName = 'CoinCDX';
        const target = 'USDT';

        try {
            const response = await axios.get(url);
            const markets: CoincdxMarketData[] = response.data;
            const xem = markets.find((market) => market.market === 'XEMUSDT');

            if (!xem) {
                console.log(
                    `Failed to get market data from exchange ${exchangeName}. Cannot find market`,
                );
                return null;
            }

            return {
                target,
                isUSD: Utils.isUSDTicker(target),
                price: Number(xem.last_price),
                volume: Number(xem.volume),
            };
        } catch (e) {
            console.error(
                `Failed to get market data from exchange ${exchangeName}`,
                (e as Error).message,
            );
            return null;
        }
    }

    static async getLiquidInfo(): Promise<MarketData | null> {
        const url = 'https://api.liquid.com/products/113';
        const exchangeName = 'Liquid';
        const target = 'BTC';

        try {
            const response = await axios.get(url);
            const xem: LiquidMarketData = response.data;

            return {
                target,
                isUSD: Utils.isUSDTicker(target),
                price: Number(xem.last_traded_price),
                volume: Number(xem.volume_24h),
            };
        } catch (e) {
            console.error(
                `Failed to get market data from exchange ${exchangeName}`,
                (e as Error).message,
            );
            return null;
        }
    }

    static async getProbitInfo(): Promise<MarketData | null> {
        const url =
            'https://api.probit.com/api/exchange/v1/ticker?market_ids=XEM-USDT';
        const exchangeName = 'Probit';
        const target = 'USDT';

        try {
            const response = await axios.get(url);
            const xem: ProbitMarketData = response.data.data;

            return {
                target,
                isUSD: Utils.isUSDTicker(target),
                price: Number(xem.last),
                volume: Number(xem.quote_volume),
            };
        } catch (e) {
            console.error(
                `Failed to get market data from exchange ${exchangeName}`,
                (e as Error).message,
            );
            return null;
        }
    }

    static async getValrInfo(): Promise<MarketData | null> {
        const url = 'https://api.valr.com/v1/public/XEMETH/marketsummary';
        const exchangeName = 'Valr';
        const target = 'ETH';

        try {
            const response = await axios.get(url);
            const xem: ValrMarketData = response.data;

            return {
                target,
                isUSD: Utils.isUSDTicker(target),
                price: Number(xem.lastTradedPrice),
                volume: 0,
            };
        } catch (e) {
            console.error(
                `Failed to get market data from exchange ${exchangeName}`,
                (e as Error).message,
            );
            return null;
        }
    }

    static async getZtInfo(): Promise<MarketData | null> {
        const url = 'https://www.ztb.im/api/v1/tickers';
        const exchangeName = 'ZtGlobal';
        const target = 'USDT';

        try {
            const response = await axios.get(url);
            const markets: ZtMarketData[] = response.data.ticker;
            const xem = markets.find((market) => market.symbol === 'XEM_USDT');

            if (!xem) {
                console.log(
                    `Failed to get market data from exchange ${exchangeName}. Cannot find market`,
                );
                return null;
            }

            return {
                target,
                isUSD: Utils.isUSDTicker(target),
                price: Number(xem.last),
                volume: Number(xem.vol),
            };
        } catch (e) {
            console.error(
                `Failed to get market data from exchange ${exchangeName}`,
                (e as Error).message,
            );
            return null;
        }
    }
}
