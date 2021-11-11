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

import { ReactVuexStore } from 'react-vuex-store';
import { ExchangeService } from 'src/infrastructure/ExchangeService';
import { Exchange } from 'src/models/Exchange';
import { RootStoreState } from '.';

export type ExchangeStoreState = {
    list: Exchange[];
};

export default ReactVuexStore.createModule<ExchangeStoreState, RootStoreState>({
    namespace: 'exchange',
    state: {
        list: [],
    },
    mutations: {
        list(store, payload: ExchangeStoreState['list']) {
            store.exchange.list = payload;
        },
    },
    actions: {
        load: async ({ commit }): Promise<void> => {
            const list = ExchangeService.getExchangeList();

            commit<ExchangeStoreState['list']>({
                type: 'exchange/list',
                payload: list,
            });
        },
    },
});
