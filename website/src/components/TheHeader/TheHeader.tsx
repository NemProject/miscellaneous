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

import React, { useEffect } from 'react';
import store, { connect, RootStoreState } from 'src/store';
import { ContentContainer } from 'src/components';
import ButtonCloseImageUrl from 'src/assets/images/button-close.png';
import './TheHeader.less';

interface Props {
    announcement: RootStoreState['announcement']['latest'];
}

const TheHeaderComponent = (props: Props): JSX.Element => {
    const { announcement } = props; 
    useEffect(() => { 
        store.dispatchAction({type: 'announcement/load'})
    }, []);

    const hide = () => {
        if (announcement) {
            store.dispatchAction({type: 'announcement/hide', payload: announcement.id})
            store.dispatchAction({type: 'announcement/load'})
        }
    }

    return (announcement 
        ? <div className="header">
            <ContentContainer>
                <div className="header-text">
                    {announcement.text}
                </div>
                <img 
                    className="header-close" 
                    src={ButtonCloseImageUrl} 
                    onClick={() => hide()} 
                />
            </ContentContainer>
        </div>
        : <></> 
    );
}

export const TheHeader = connect((state: RootStoreState) => ({
    announcement: state.announcement.latest
}))(TheHeaderComponent);