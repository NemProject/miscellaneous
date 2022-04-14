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
import { ExchangeInfo } from 'src/models/Exchange';
import { RootStoreState } from '.';

export type ExchangeStoreState = {
    list: ExchangeInfo[];
    isError: boolean;
    isLoading: boolean;
};

export default ReactVuexStore.createModule<ExchangeStoreState, RootStoreState>({
    namespace: 'exchange',
    state: {
        list: [],
        isError: false,
        isLoading: true,

    },
    mutations: {
        list(store, payload: ExchangeStoreState['list']) {
            store.exchange.list = payload;
        },
        isError(store, payload: ExchangeStoreState['isError']) {
            store.exchange.isError = payload;
        },
        isLoading(store, payload: ExchangeStoreState['isLoading']) {
            store.exchange.isLoading = payload;
        },
    },
    actions: {
        load: async ({ commit }): Promise<void> => {
            commit<ExchangeStoreState['isError']>({
                type: 'exchange/isError',
                payload: false,
            });
            commit<ExchangeStoreState['isLoading']>({
                type: 'exchange/isLoading',
                payload: true,
            });

            try {
                const list = await ExchangeService.getExchangeList();

                commit<ExchangeStoreState['list']>({
                    type: 'exchange/list',
                    payload: list,
                });
                commit<ExchangeStoreState['isError']>({
                    type: 'exchange/isError',
                    payload: false,
                });
                commit<ExchangeStoreState['isLoading']>({
                    type: 'exchange/isLoading',
                    payload: false,
                });
            }
            catch(e) {
                console.error(e);
                commit<ExchangeStoreState['isError']>({
                    type: 'exchange/isError',
                    payload: false,
                });
                commit<ExchangeStoreState['isLoading']>({
                    type: 'exchange/isLoading',
                    payload: true,
                });
            }
        },
    },
});
