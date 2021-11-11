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
import { AnnouncementService } from 'src/infrastructure/AnnouncementService';
import { Announcement } from 'src/models/Announcement';
import { RootStoreState } from '.';

export type AnnouncementStoreState = {
    latest: Announcement | null;
};

export default ReactVuexStore.createModule<
    AnnouncementStoreState,
    RootStoreState
>({
    namespace: 'announcement',
    state: {
        latest: null,
    },
    mutations: {
        latest(store, payload: AnnouncementStoreState['latest']) {
            store.announcement.latest = payload;
        },
    },
    actions: {
        load: async ({ commit }): Promise<void> => {
            const latest = await AnnouncementService.getAnnouncement();

            commit<AnnouncementStoreState['latest']>({
                type: 'announcement/latest',
                payload: latest,
            });
        },
        hide: async ({ commit }, announcementId: number): Promise<void> => {
            commit<AnnouncementStoreState['latest']>({
                type: 'announcement/latest',
                payload: null,
            });
            AnnouncementService.hideNotification(announcementId);
        },
    },
});
