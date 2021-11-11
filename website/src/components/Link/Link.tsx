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

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    hideArrows?: boolean;
}

export const Link: React.FunctionComponent<Props> = (props): JSX.Element => {
    const { children, hideArrows, ...rest } = props;

    return (
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
    );
};
