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
import './HorizontalLine.less';

export const HorizontalLine: React.FunctionComponent<React.HTMLAttributes<SVGElement>> = (props): JSX.Element => {
    return (
        <svg 
            className="horizontal-line-svg"
            height="10" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <svg 
                className="horizontal-line-svg"
                height="2px" 
                preserveAspectRatio="xMinYMid" 
                fill="none" 
            >
                <rect
                    className="horizontal-line-svg-fill"
                    width="100%" 
                    height="2" 
                    stroke="none"
                    stroke-width="0"
                />
            </svg>
            <svg
                y="1px" 
                width="64" 
                height="8" 
                viewBox="0 0 64 8" 
                fill="none"
            >
                <path 
                    className="horizontal-line-svg-fill"
                    d="M0 8V0H64L55.619 8H0Z"
                />
            </svg>
        </svg>
    );
}
