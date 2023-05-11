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

import Axios from 'axios';
import { CopyService } from 'src/infrastructure/CopyService';
import { Storage } from 'src/infrastructure/Storage';
import { Announcement, AnnouncementObject } from 'src/models/Announcement';
import { Utils } from 'src/utils';
import { Config } from 'src/config';

export class AnnouncementService {
    // Returns latest not viewed announcement
    public static async getAnnouncement(): Promise<Announcement | null> {
        const currentLanguage = CopyService.getCurrentLanguage();
        const latestAnnouncements = await AnnouncementService.fetchAnnouncemets(
            currentLanguage,
        );
        const viewedAnnouncementIds =
            AnnouncementService.getViewedAnnouncementIds();
        const notViewedAnnouncements = latestAnnouncements.filter(
            (announcement) => !viewedAnnouncementIds.includes(announcement.id),
        );

        return notViewedAnnouncements.shift() || null;
    }

    // Adds announcement id to the viewed list and stores it in the storage
    public static hideNotification(notificationId: number): void {
        const viewedAnnouncements =
            AnnouncementService.getViewedAnnouncementIds();

        Utils.pushUnique(viewedAnnouncements, notificationId);
        Storage.set('viewedAnnouncements', JSON.stringify(viewedAnnouncements));
    }

    // Fetch announcement from server
    private static async fetchAnnouncemets(
        lang: string,
    ): Promise<Announcement[]> {
        const rawAnnouncements: AnnouncementObject = (
            await Axios.get(Config.URL_ANNOUNCEMETS)
        ).data;
        const announcements = rawAnnouncements[lang] || [];

        return announcements;
    }

    // Returns the list of ids of the viewed announcements
    private static getViewedAnnouncementIds(): number[] {
        let viewedAnnouncements = [];
        try {
            const viewedAnnouncementsJSON =
                Storage.get('viewedAnnouncements') || '[]';
            viewedAnnouncements = JSON.parse(viewedAnnouncementsJSON);
        } catch {}

        return viewedAnnouncements;
    }
}
