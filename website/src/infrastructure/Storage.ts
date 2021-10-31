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

export class Storage {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static set = (key: string, value: string): string | null => {
        localStorage.setItem(key, value);
        return value;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static get = (key: string): string | null => {
        try {
            const value = localStorage.getItem(key);
            return value;
        } catch (e) {
            return null;
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static remove = (key: string): string | null => {
        localStorage.removeItem(key);
        return key;
    };
}
