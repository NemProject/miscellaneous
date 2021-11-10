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
import './Expand.less';
type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

interface ExpandProps {
    linkText: string;
    linkClassName?: string;
    containerClassName?: string;
    expanded?: boolean;
    onClick?: (expanded: boolean) => void;
}

export const Expand:
    React.FunctionComponent<SimpleSpread<React.HTMLAttributes<HTMLDivElement>, ExpandProps>> 
    = (props): JSX.Element => {
        const {
            children,
            linkText,
            linkClassName,
            containerClassName,
            className,
            expanded,
            onClick,
            ...rest
        } = props;

        const [_expanded, setExpanded] = React.useState(false);
        React.useEffect(() => {
            if (!!expanded !== _expanded) {
                setExpanded(!!expanded);
            }
        }, [expanded]);
        const ref = React.useRef<HTMLDivElement>(null);
        const toggle = (value: boolean) => {
            setExpanded(value);
            onClick && onClick(value);
            
            if (value) {
                setTimeout(() => {
                    ref.current && ref.current.scrollIntoView();
                }, 200);
            }
        };

        const extendedClassName = 'expand' + (className ? ' ' + className : '');
        const extendedLinkClassName = 'expand-link' + (linkClassName ? ' ' + linkClassName : '');
        const extendedContainerClassName = 'expand-container' + (containerClassName ? ' ' + containerClassName : '');
        const arrowClassName = 'expand-arrow' + (_expanded ? ' expand-arrow-active' : '');

        return (
            <div className={extendedClassName} {...rest}>
                <div className="expand-link-triangle-group" ref={ref}>
                    <div 
                        className={extendedLinkClassName}
                        onClick={() => toggle(!_expanded)}
                    >
                        {linkText}
                        <svg 
                            className={arrowClassName}
                            width="21" 
                            height="26" 
                            viewBox="0 0 21 26" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                        <path 
                            d="M21 13L-1.14193e-06 25.1244L-8.1987e-08 0.875644L21 13Z" 
                        />
                        </svg>
                    </div>
                </div>
                {_expanded && <div className={extendedContainerClassName}>
                    {children}
                </div>}
            </div>
        );
    }
