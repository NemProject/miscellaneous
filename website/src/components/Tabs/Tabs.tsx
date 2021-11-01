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

import * as React from 'react';
import './Tabs.less';

type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;
interface TabItem {
    text: string;
    value: number | string;
}

interface Props {
    items?: TabItem[];
    value?: number | string;
    onChange?: (value: number | string) => void;
}

export const Tabs: React.FunctionComponent<SimpleSpread<React.HTMLAttributes<HTMLDivElement>, Props>> = (props): JSX.Element => {
    const { 
        items,
        value,
        className,
        onChange
    } = props;

    const extendedClassName = 'tabs' + (className ? ' ' + className : '');

    return (
        <div className={extendedClassName}>
            {!!items && items.map((item: TabItem) => (
                <div 
                    className={`tabs-item ${item.value === value ? 'tabs-item-active' : ''}`} 
                    onClick={() => onChange && onChange(item.value)}
                >
                    <div className="tabs-item-text">{item.text}</div>
                </div>
            ))}
        </div>
    );
}
