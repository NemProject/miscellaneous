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
import ArtistMahoImageUrl from 'src/assets/images/button-circle-close.png';
import './ModalBox.less';

type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

interface Props {
    visible?: boolean;
    onClose?: () => void;
}

export const ModalBox: 
    React.FunctionComponent<SimpleSpread<React.HTMLAttributes<HTMLDivElement>, Props>> 
    = (props): JSX.Element => {
    const { 
        children,
        className,
        visible,
        onChange,
        onClose,
        ...rest
    } = props;

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
                    {children}
                    <img 
                        className="modal-box-close" 
                        src={ArtistMahoImageUrl}
                        onClick={() => onClose && onClose()}
                    />
                </div>
            </div>
        </div>
    }</>);
}
