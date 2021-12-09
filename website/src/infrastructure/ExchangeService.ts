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

import { Exchange } from 'src/models/Exchange';

export class ExchangeService {
    // Hardcoded exchange list
    private static staticExchangeList: Exchange[] = [
        {
            imageSrc: require('src/assets/images/exchanges/aex.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/aofex.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/ascendex.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/bibox.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/binance.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/bione.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/bit-bns.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/bithumb.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/bitmart.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/bitrue.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/bittrex.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/bitvavo.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/bkex.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/btc-trade-ua.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/coindcx.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/coinex.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/coinsbit.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/cointiger.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/crex24.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/dex-trade.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/digifinex.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/dragonex.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/exmo.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/exrates.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/gete-io.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/goku-market.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/hitbtc.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/hotbit.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/huobi.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/indodax.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/kucoin.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/kuna.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/latoken.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/liquid.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/mandala.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/mexo-io.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/okex.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/p2p-b2b.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/pionex.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/poloniex.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/probit.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/tokocrypto.png')
                .default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/upbit.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/valr.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/vindax.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/warizx.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/wbf.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/xt-com.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/yobit.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/zaif.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/zb-com.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/zbg.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/zipmex.png').default,
            url: 'https://___/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/zt-global.png')
                .default,
            url: 'https://___/',
        },
    ];

    // Returns exchange list
    static getExchangeList(): Exchange[] {
        return ExchangeService.staticExchangeList;
    }
}
