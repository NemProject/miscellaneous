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
import { ExchangeInfo, ExchangeConfig } from 'src/models/Exchange';
import { Config, exchanges } from 'src/config';

interface Ticker {
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

export class ExchangeService {
    // Returns exchange list
    static async getExchangeList(): Promise<ExchangeInfo[]> {
        const exchangeList: ExchangeConfig[] = exchanges;
        const response = await axios.get(Config.URL_MARKET_DATA);
        const usdTickers = ['USD', 'USDT', 'USDC', 'BUSD'];
        const targetPriority = [...usdTickers, 'BTC', 'ETH'];
        const targetOrderIndexes: Record<string, number> = {};

        for (let index = 0; index < targetPriority.length; index++) {
            targetOrderIndexes[targetPriority[index]] = index;
        }

        const tickerList: ExchangeInfo[] = response.data.tickers
            .map((ticker: Ticker) => ({
                isUSD: usdTickers.includes(ticker.target),
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
                if (targetOrderIndexes[a.target] === undefined) {
                    return 1;
                }
                if (targetOrderIndexes[b.target] === undefined) {
                    return -1;
                }
                return (
                    targetOrderIndexes[a.target] -
                        targetOrderIndexes[b.target] || 0
                );
            });

        let currentExchangeId;
        const marketData: ExchangeInfo[] = [];

        for (const ticker of tickerList) {
            if (currentExchangeId !== ticker.exchangeId) {
                marketData.push(ticker);
                currentExchangeId = ticker.exchangeId;
            }
        }

        const list = exchangeList.map(ex => ({
            ...(marketData.find(m => m.exchangeId === ex.exchangeId) || {}),
            ...ex,
        }));

        //@ts-ignore
        return list;
    }
}
