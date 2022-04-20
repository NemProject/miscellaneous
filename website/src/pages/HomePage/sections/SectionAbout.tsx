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
import { Button, ContentContainer } from 'src/components';
import HeroMountainImageUrl from 'src/assets/images/hero-mountain.png';
import { Row } from 'antd';
import { $t } from 'src/infrastructure/CopyService';
import { JSXUtils } from 'src/utils';
import './SectionAbout.less';

export default function HomePage(): JSX.Element {
    return (
        <div className="section section-1">
            <ContentContainer>
                <div className="content">
                    <h2>{$t('home_about_title')}</h2>
                    <div>
                        {JSXUtils.createParagraph(
                            $t('home_about_content'),
                            'hero',
                        )}
                    </div>
                    <Row className="buttons">
                        <Button>{$t('home_about_button_github')}</Button>
                        <Button>{$t('home_about_button_discord')}</Button>
                    </Row>
                </div>
                <div className="hero-image-container">
                    <img className="hero-image" src={HeroMountainImageUrl} />
                </div>
            </ContentContainer>
        </div>
    );
}
