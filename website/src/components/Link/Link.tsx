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
import './Link.less';

interface Props extends React.HTMLAttributes<HTMLElement> {
    hideArrows?: boolean;
    href?: string;
    variant?: 'internal'| 'external'
}

export const Link: React.FunctionComponent<Props> = (props): JSX.Element => {
    const { children, hideArrows, href, variant = 'internal', ...rest } = props;

    return (<>
        {variant === 'internal' && (
            <button className="link" {...rest}>
                {children}
                {!hideArrows && (
                    <svg
                        className="link-arrow"
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.8877 4C7.04494 4 7.19302 4.07396 7.28746 4.19968L12.9218 11.6997C13.0555 
                        11.8776 13.0555 12.1224 12.9218 12.3003L7.28746 19.8003C7.19302 19.926 7.04494 
                        20 6.8877 20H4.63862C4.22638 20 3.99125 19.5292 4.23889 19.1996L9.42337 12.3004C9.55708 
                        12.1224 9.55708 11.8776 9.42337 11.6996L4.23889 4.80037C3.99125 4.47081 4.22638 
                        4 4.63862 4H6.8877ZM14.8877 4C15.045 4 15.193 4.07396 15.2875 4.19968L20.9218"
                        />
                    </svg>
                )}
            </button>
        )}
        {variant === 'external' && (
            <a
                target="_blank"
                rel="noopener noreferrer"
                className="link-external"
                href={href}
                {...rest}
            >
                {children}
                    <svg 
                        width="19" 
                        height="19" 
                        viewBox="0 0 19 19" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8232 9.50008C16.8232 13.5444 13.5447 16.823 9.50033 16.823C5.45599 16.823 2.17741 13.5444 2.17741 9.50008C2.17741 5.45574 5.45599 2.17716 9.50033 2.17716C13.5447 2.17716 16.8232 5.45575 16.8232 9.50008ZM9.50033 18.0105C14.2005 18.0105 18.0107 14.2003 18.0107 9.50008C18.0107 4.79991 14.2005 0.989663 9.50033 0.989663C4.80015 0.989662 0.989909 4.79991 0.989908 9.50008C0.989908 14.2003 4.80015 18.0105 9.50033 18.0105ZM9.87215 11.4552C9.64028 11.6871 9.64027 12.063 9.87214 12.2949C10.104 12.5268 10.48 12.5268 10.7118 12.2949L13.0868 9.91996C13.1982 9.80861 13.2607 9.65758 13.2607 9.50011C13.2607 9.34264 13.1982 9.19161 13.0868 9.08026L10.7118 6.70526C10.48 6.47339 10.104 6.47339 9.87215 6.70526C9.64027 6.93714 9.64027 7.31308 9.87215 7.54495L11.2336 8.90636L6.33366 8.90636C6.00574 8.90636 5.73991 9.17219 5.73991 9.50011C5.73991 9.82803 6.00574 10.0939 6.33366 10.0939L11.2335 10.0939L9.87215 11.4552Z" fill="#4FB9AC"/>
                    </svg>
            </a>
        )}
    </>);
};
