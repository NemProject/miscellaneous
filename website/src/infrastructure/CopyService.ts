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
import { LocaleObject } from 'src/models/LocaleObject';
import english from 'src/locales/english.json';

type Locale = typeof english;

const MISSING_TRANSLATION_MESSAGE = 'missing_translation_';

export class CopyService {
    // Available languages
    private static languages: string[] = ['eng'];

    private static defaultLanguage = 'eng';

    private static getCurrentLocale(): Locale {
        const currentLanguage = CopyService.getCurrentLanguage();

        switch (currentLanguage) {
            default:
            case 'eng':
                return english;
        }
    }

    // Returns default language
    static getdefaultLanguage(): string {
        return CopyService.defaultLanguage;
    }

    // Returns available languages
    static getLanguages(): string[] {
        return CopyService.languages;
    }

    // Returns current language
    static getCurrentLanguage(): string {
        const currentLanguage =
            Storage.get('currentLanguage') || CopyService.defaultLanguage;
        const supportedLanguages = CopyService.getLanguages();

        if (!supportedLanguages.includes(currentLanguage)) {
            return CopyService.defaultLanguage;
        } else {
            return currentLanguage;
        }
    }

    // Returns copy by key depeding on the current language
    static getCopy(key: string): string {
        const locale = CopyService.getCurrentLocale() as LocaleObject;
        const keyExists = locale.hasOwnProperty(key);

        if (keyExists) {
            return locale[key];
        } else {
            return MISSING_TRANSLATION_MESSAGE + key;
        }
    }
}
