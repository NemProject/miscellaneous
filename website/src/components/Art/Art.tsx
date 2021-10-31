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
import { Link } from 'src/components';
import './Art.less';

type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

interface TabItem {
    text: string;
    value: number | string;
}

interface Props {
    className?: string;
    src?: string;
    imageClassName?: string;
    linkText?: string;
    onClick?: () => void;
}

export const Art: 
    React.FunctionComponent<Props> 
    = (props): JSX.Element => {
    const { 
        className,
        src,
        imageClassName,
        linkText,
        onClick,
    } = props;

    const extendedClassName = 'art' + (className ? ' ' + className : '');

    return (
        <div className={extendedClassName}>
            <img src={src} className={imageClassName} />
            {linkText && <Link onClick={onClick}>{linkText}</Link>}
        </div>
    );
}
