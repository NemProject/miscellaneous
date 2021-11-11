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
            imageSrc: require('src/assets/images/exchanges/Group 2535.png')
                .default,
            url: 'https://binance.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2536.png')
                .default,
            url: 'https://huobi.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2537.png')
                .default,
            url: 'https://okex.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2538.png')
                .default,
            url: 'https://kucoin.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2539.png')
                .default,
            url: 'https://ascendex.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2540.png')
                .default,
            url: 'https://bithumb.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2541.png')
                .default,
            url: 'https://liquid.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2542.png')
                .default,
            url: 'https://upbit.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2543.png')
                .default,
            url: 'https://bittrex.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2545.png')
                .default,
            url: 'https://bibox.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2546.png')
                .default,
            url: 'https://latoken.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2547.png')
                .default,
            url: 'https://hotbit.io/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2548.png')
                .default,
            url: 'https://wazirx.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2550.png')
                .default,
            url: 'https://probit.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2551.png')
                .default,
            url: 'https://hitbtc.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2552.png')
                .default,
            url: 'https://digifinex.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2553.png')
                .default,
            url: 'https://gokumarket.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2554.png')
                .default,
            url: 'https://__/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2556.png')
                .default,
            url: 'https://cointiger.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2557.png')
                .default,
            url: 'https://poloniex.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2558.png')
                .default,
            url: 'https://bione.info/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2559.png')
                .default,
            url: 'https://coindcx.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2560.png')
                .default,
            url: 'https://pionex.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2561.png')
                .default,
            url: 'https://valr.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2562.png')
                .default,
            url: 'https://bitvavo.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2563.png')
                .default,
            url: 'https://aex.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2564.png')
                .default,
            url: 'https://coinex.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2565.png')
                .default,
            url: 'https://bitrue.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2566.png')
                .default,
            url: 'https://bitmart.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2572.png')
                .default,
            url: 'https://mexo.io/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2573.png')
                .default,
            url: 'https://__/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2574.png')
                .default,
            url: 'https://kuna.io/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2575.png')
                .default,
            url: 'https://zb.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2576.png')
                .default,
            url: 'https://zaif.jp/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2591.png')
                .default,
            url: 'https://__/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2593.png')
                .default,
            url: 'https://ztb.im/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2594.png')
                .default,
            url: 'https://p2pb2b.io/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2595.png')
                .default,
            url: 'https://coinsbit.io/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2596.png')
                .default,
            url: 'https://vindax.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2597.png')
                .default,
            url: 'https://yobit.net/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2598.png')
                .default,
            url: 'https://mandala.exchange/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2599.png')
                .default,
            url: 'https://dragonex.io/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2600.png')
                .default,
            url: 'https://exrates.me/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2601.png')
                .default,
            url: 'https://xt.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2602.png')
                .default,
            url: 'https://dex-trade.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2603.png')
                .default,
            url: 'https://exmo.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2604.png')
                .default,
            url: 'https://gate.io/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2605.png')
                .default,
            url: 'https://tokocrypto.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2614.png')
                .default,
            url: 'https://crex24.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2615.png')
                .default,
            url: 'https://__/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2616.png')
                .default,
            url: 'https://indodax.com/',
        },
        {
            imageSrc: require('src/assets/images/exchanges/Group 2618.png')
                .default,
            url: 'https://bitbns.com/',
        },
    ];

    // Returns exchange list
    static getExchangeList(): Exchange[] {
        return ExchangeService.staticExchangeList;
    }
}
