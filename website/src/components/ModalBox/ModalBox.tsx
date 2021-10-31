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
import './ModalBox.less';

type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

interface TabItem {
    text: string;
    value: number | string;
}

interface Props {
    visible?: boolean;
    items?: TabItem[];
    value?: number | string;
    onChange?: (value: number | string) => void;
    onClose?: () => void;
}

export const ModalBox: 
    React.FunctionComponent<SimpleSpread<React.HTMLAttributes<HTMLDivElement>, Props>> 
    = (props): JSX.Element => {
    const { 
        children,
        className,
        items,
        value,
        visible,
        onChange,
        onClose,
        ...rest
    } = props;

    const onFirst = () => {
        onChange && items && items.length && onChange(items[0].value);
    };

    const onNext = () => {
        if (onChange && items && items.length) {
            const currentIndex = items.findIndex(item => item.value === value);
            currentIndex + 1 < items.length && onChange(items[currentIndex + 1].value);
        }
    };

    const extendedClassName = 'modal-wrapper' + (className ? ' ' + className : '');

    return (<>{visible && 
        <div 
            onClick={() => onClose && onClose()}
            className="modal-shaddow"
        >
            <div 
                className={extendedClassName}
                {...rest}
            >
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-box-lightbox-wrapper">
                        <div className="modal-box-lightbox" />
                    </div>
                    <div className="modal-box-bottom-lazer" />
                    <div className="modal-box-tl" />
                    <div className="modal-box-tm" />
                    <div className="modal-box-tr" />
                    <div className="modal-box-bl" />
                    <div className="modal-box-br"/>
                    <div className="modal-box-controls">
                        <svg 
                            width="194" 
                            height="33" 
                            viewBox="0 0 194 33" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* goFirst button */}
                            <g>
                                <path 
                                    className="modal-box-control"
                                    d="M186.378 12.8745V9.63991H183.835V12.7263C183.835 13.1708 183.736 13.3436 183.366 13.6646L181.218 15.5165L178.502 13.5658C178.181 13.3189 178.156 13.2202 178.156 12.7263V9.63991H175.637V12.8004C175.637 14.0844 176.057 14.7017 176.798 15.2202L178.798 16.7017L176.749 18.4054C175.81 19.1955 175.637 19.8375 175.637 21.072V23.9609H178.156V21.1708C178.156 20.3807 178.205 20.2819 178.6 19.9609L180.798 18.1091L183.366 19.9609C183.786 20.2572 183.81 20.3313 183.81 21.072V23.9609H186.353V20.8745C186.353 19.6399 186.082 19.0227 185.218 18.3807L183.218 16.9239L185.168 15.2942C185.909 14.677 186.378 14.1338 186.378 12.8745Z" 
                                />
                                <rect 
                                    onClick={() => onFirst()}
                                    className="modal-box-control-mask"
                                    fill="none" 
                                    stroke="none"
                                    width="30"
                                    height="30"
                                    x="3"
                                    y="3"
                                />
                            </g>
                            {/* goNext button */}
                            <g>
                                <path 
                                    className="modal-box-control"
                                    d="M80.5276 8.47594C80.4304 8.3466 80.2781 8.27051 80.1163 8.27051H77.8024C77.3783 8.27051 77.1364 8.75488 77.3912 9.09394L82.725 16.192C82.8626 16.375 82.8626 16.627 82.725 16.81L77.3912 23.908C77.1364 24.2471 77.3783 24.7315 77.8024 24.7315H80.1163C80.2781 24.7315 80.4304 24.6554 80.5276 24.526L86.3243 16.81C86.4618 16.6269 86.4618 16.375 86.3243 16.192L80.5276 8.47594Z" 
                                />
                                <rect 
                                    onClick={() => onNext()}
                                    className="modal-box-control-mask"
                                    fill="none" 
                                    stroke="none"
                                    width="30"
                                    height="30"
                                    x="65"
                                    y="3"
                                />
                            </g>
                            {/* goClose button */}
                            <g>
                                <path
                                    className="modal-box-control"
                                    fill-rule="evenodd" 
                                    clip-rule="evenodd" 
                                    d="M22.1591 8.27002C21.9973 8.27002 21.8449 8.34612 21.7478 8.47545L15.9511 16.1915C15.8136 16.3746 15.8136 16.6264 15.9511 16.8095L21.7478 24.5255C21.8449 24.6549 21.9973 24.731 22.1591 24.731H24.4729C24.8971 24.731 25.139 24.2466 24.8842 23.9075L19.5503 16.8095C19.4128 16.6265 19.4128 16.3745 19.5503 16.1915L24.8842 9.09345C25.139 8.7544 24.8971 8.27002 24.4729 8.27002H22.1591ZM13.9281 8.27002C13.7663 8.27002 13.614 8.34612 13.5168 8.47545L7.72011 16.1915C7.58261 16.3746 7.58261 16.6264 7.72011 16.8095L13.5168 24.5255C13.614 24.6549 13.7663 24.731 13.9281 24.731H16.242C16.6661 24.731 16.908 24.2466 16.6532 23.9075L11.3194 16.8095C11.1818 16.6265 11.1818 16.3745 11.3194 16.1915L16.6532 9.09345C16.908 8.7544 16.6661 8.27002 16.242 8.27002H13.9281Z" 
                                />
                                <rect 
                                    onClick={() => onClose && onClose()}
                                    className="modal-box-control-mask"
                                    width="30"
                                    height="30"
                                    x="165"
                                    y="3"
                                />
                            </g>
                        </svg>
                    </div>
                    <div className="modal-box-container">
                        <div className="modal-box-content">
                            {children}
                        </div>
                        {items && <div className="modal-box-tabs">
                            {items.map(item => (
                                <h3 
                                    className={'modal-box-tabs-item' + (item.value === value ? ' modal-box-tabs-item-active' : '')}
                                    onClick={() => onChange && onChange(item.value)}
                                >
                                    {item.value === value && <div className="arrow-left" />}
                                    {item.text}
                                </h3>
                            ))}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    }</>);
}
