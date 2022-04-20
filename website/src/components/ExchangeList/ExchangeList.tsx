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

import React, {useState} from 'react';
import { Link } from 'src/components';
import { $t } from 'src/infrastructure/CopyService';
import { ExchangeInfo } from 'src/models/Exchange';
import './ExchangeList.less';

interface Props {
    className?: string;
    exchangeInfoList: ExchangeInfo[];
}

export const ExchangeList: React.FunctionComponent<Props> = (props): JSX.Element => {
    const { className, exchangeInfoList } = props;
    const extendedClassName = className ? 'exchange-list ' + className : 'exchange-list';

    const [expandedIndex, setExpandedIndex] = useState<number>(-1);

    const selectItem = (index: number) => {
        if (index === expandedIndex) {
            setExpandedIndex(-1);
        }
        else {
            setExpandedIndex(index);
        }
    };

    const getPriceText = (exchange: ExchangeInfo) => 
        exchange.price 
            ? (exchange.isUSD ? '$' + exchange.price : exchange.price + ' ' + exchange.target)
            : '-';

    const getVolumeText = (exchange: ExchangeInfo) => 
        exchange.volume 
            ? '$' + exchange.volume
            : '-';
 

    return (
        <div className={extendedClassName}>
           {exchangeInfoList.map((exchange, index) => (<>
                <div 
                    className={'exchange-item' + (index === expandedIndex ? ' selected' : '')} 
                    onClick={() => selectItem(index)}
                    key={'ex' + index}
                >
                    <img
                        className="image-exchange"
                        src={exchange.imageSrc}
                        alt={exchange.exchangeName}
                    />
                </div>
                {index === expandedIndex && (
                    <div 
                        className="exchange-details" 
                        key={'exd' + index}
                    >
                        <div className="exchange-details-table">
                            <div className="exchange-details-amount">
                                <div className="exchange-details-th">
                                    XEM Price
                                </div>
                                {getPriceText(exchange)}
                            </div>
                            <div className="exchange-details-amount">
                                <div className="exchange-details-th">
                                    24 Hour Volume
                                </div>
                                {getVolumeText(exchange)}
                            </div>
                            <div className="exchange-details-desc">
                                <div className="exchange-details-th">
                                    Exchange Info
                                </div>
                                <div className="description-text">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </div>
                            </div>
                        </div>
                        <Link variant="external" href={exchange.url}>Visit Exchange</Link>
                    </div>
                )}
           </>))}
        </div>
    );
};
