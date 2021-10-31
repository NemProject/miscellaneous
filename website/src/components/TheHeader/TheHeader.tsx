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

import React from 'react';
import { Row } from 'antd';
import { 
    ContentContainer,
} from 'src/components';
import { Config } from 'src/config';
import './TheHeader.less';

export const TheHeader = (): JSX.Element => {
    const announcement = '🎉  Announcement... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim, ipsum in mi gravida tristique diam justo, ultricies ac.';

    return (announcement 
        ? <div className="header">
            <ContentContainer>
                <div className="header-text">
                    {announcement}
                </div>
            </ContentContainer>
        </div>
        : <></> 
    );
}
