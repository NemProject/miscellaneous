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

import { Storage } from 'src/infrastructure/Storage';
import { LocaleObject } from 'src/models/Locale';
import en from 'src/locales/en.json';

type Locale = typeof en;

export class CopyService {
    // Supported languages
    private static languages: string[] = ['en'];
    private static defaultLanguage = 'en';

    /**
     * Returns locale object depeding on the current language
     * @returns {string} locale object
     */
    private static getCurrentLocale(): Locale {
        const currentLanguage = CopyService.getCurrentLanguage();

        switch (currentLanguage) {
            default:
            case 'en':
                return en;
        }
    }

    /**
     * Returnsns all supported languages
     * @returns {string[]} list of languages
     */
    static getLanguages(): string[] {
        return CopyService.languages;
    }

    /**
     * Returns user selected or default language
     * @returns {string} current language
     */
    static getCurrentLanguage(): string {
        const currentLanguage =
            Storage.get('currentLanguage') || CopyService.defaultLanguage;
        const supportedLanguages = CopyService.getLanguages();

        if (!supportedLanguages.includes(currentLanguage)) {
            console.error(
                `Current language "${currentLanguage}" is not supported. Switching to default.`,
            );

            return CopyService.defaultLanguage;
        } else {
            return currentLanguage;
        }
    }

    /**
     * Sets user language
     * @param {string} lang - language
     */
    static setCurrentLanguage(lang: string): void {
        const supportedLanguages = CopyService.getLanguages();

        if (supportedLanguages.includes(lang)) {
            Storage.set('currentLanguage', lang);
        } else {
            console.error(
                `Failed to set current language. Language "${lang}"" is not supported`,
            );
        }
    }

    /**
     * Returns copy by key depeding on the current language
     * @param {string} key - translation key
     * @returns {string} translated copy text
     */
    static getCopy(key: string): string {
        const locale = CopyService.getCurrentLocale() as LocaleObject;
        const keyExists = locale.hasOwnProperty(key);

        if (keyExists) {
            return locale[key];
        } else {
            const currentLanguage = CopyService.getCurrentLanguage();

            return `[missing_translation](${currentLanguage})${key}`;
        }
    }
}

export const $t = CopyService.getCopy;
