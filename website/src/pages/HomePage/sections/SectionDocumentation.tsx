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
import { Art, Button, ContentContainer } from 'src/components';
import HeroLamaImageUrl from 'src/assets/images/hero-lama.png';
import { Row } from 'antd';
import { $t } from 'src/infrastructure/CopyService';
import { JSXUtils } from 'src/utils';
import './SectionDocumentation.less';

export default function SectionDocumentation(): JSX.Element {
    return (
        <div className="section section-2">
            <ContentContainer>
                <Art
                    className="hero-image-container"
                    imageClassName="hero-image"
                    artName={$t('art_alpaca_name')}
                    artDescription={$t('art_alpaca_desc')}
                    src={HeroLamaImageUrl}
                />
                <div className="content">
                    <h2>{$t('home_documentation_title')}</h2>
                    <div>
                        {JSXUtils.createParagraph(
                            $t('home_documentation_content'),
                        )}
                    </div>
                    <Row>
                        <Button>{$t('home_documentation_button')}</Button>
                    </Row>
                </div>
            </ContentContainer>
        </div>
    );
}
