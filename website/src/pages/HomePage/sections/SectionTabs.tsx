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
import React, { useState } from 'react';
import { connect, RootStoreState } from 'src/store';
import {
    Art,
    ContentContainer,
    ExchangeList,
    Expand,
    Tabs,
} from 'src/components';
import HeroBuffaloImageUrl from 'src/assets/images/hero-buffalo.png';
import HeroCowImageUrl from 'src/assets/images/hero-cow.png';
import HeroDragonImageUrl from 'src/assets/images/hero-dragon.png';
import HeroElephantImageUrl from 'src/assets/images/hero-elephant.png';
import WatercolorBlueImageUrl from 'src/assets/images/watercolor-blue.png';
import WatercolorGoldImageUrl from 'src/assets/images/watercolor-gold.png';
import WatercolorGreenImageUrl from 'src/assets/images/watercolor-green.png';
import WatercolorPurpleImageUrl from 'src/assets/images/watercolor-purple.png';
import { $t } from 'src/infrastructure/CopyService';
import { JSXUtils } from 'src/utils';
import './SectionTabs.less';

interface Props {
    exchangeList: RootStoreState['exchange']['list'];
}

function SectionTabs(props: Props): JSX.Element {
    const { exchangeList } = props;
    const [activeTab, setActiveTab] = useState<number>(0);

    const watercolorImageUrl = [
        WatercolorGreenImageUrl,
        WatercolorBlueImageUrl,
        WatercolorPurpleImageUrl,
        WatercolorGoldImageUrl,
    ][activeTab];

    const tabItems = [
        { text: $t('home_tabs_tab1_t'), value: 0 },
        { text: $t('home_tabs_tab2_t'), value: 1 },
        { text: $t('home_tabs_tab3_t'), value: 2 },
        { text: $t('home_tabs_tab4_t'), value: 3 },
    ];

    const tabItemsContent: Array<JSX.Element> = [
        <div className="section-3-tab section-3-tab-1" key="tab-1">
            <div className="content">
                <h2>{$t('home_tabs_tab1_title')}</h2>
                <div>
                    {JSXUtils.createParagraph($t('home_tabs_tab1_content'))}
                </div>
            </div>
            <Art
                className="hero-image-container"
                imageClassName="hero-image"
                artName={$t('art_buffalo_name')}
                artDescription={$t('art_buffalo_desc')}
                src={HeroBuffaloImageUrl}
            />
        </div>,
        <div className="section-3-tab section-3-tab-2" key="tab-2">
            <div className="content">
                <h2>{$t('home_tabs_tab2_title')}</h2>
                <ExchangeList exchangeInfoList={exchangeList} />
            </div>
            <Art
                className="hero-image-container"
                imageClassName="hero-image"
                artName={$t('art_cow_name')}
                artDescription={$t('art_cow_desc')}
                src={HeroCowImageUrl}
            />
        </div>,
        <div className="section-3-tab section-3-tab-3" key="tab-3">
            <div className="content">
                <h2>{$t('home_tabs_tab3_title')}</h2>
                <div>
                    {JSXUtils.createParagraph($t('home_tabs_tab3_content'))}
                </div>
            </div>
            <Art
                className="hero-image-container"
                imageClassName="hero-image"
                artName={$t('art_dragon_name')}
                artDescription={$t('art_dragon_desc')}
                src={HeroDragonImageUrl}
            />
        </div>,
        <div className="section-3-tab section-3-tab-4" key="tab-4">
            <div className="content">
                <h2>{$t('home_tabs_tab4_title')}</h2>
                <div>
                    {JSXUtils.createParagraph($t('home_tabs_tab4_content'))}
                </div>
            </div>
            <Art
                className="hero-image-container"
                imageClassName="hero-image"
                artName={$t('art_elephant_name')}
                artDescription={$t('art_elephant_desc')}
                src={HeroElephantImageUrl}
            />
        </div>,
    ];

    return (
        <div className="section section-3" active-title={activeTab}>
            <img src={watercolorImageUrl} className="image-watercolor" />
            <ContentContainer className="static">
                <div className="tabs-wrapper">
                    <Tabs
                        items={tabItems}
                        value={activeTab}
                        onChange={(value) => setActiveTab(value as number)}
                    />
                    {tabItemsContent[activeTab]}
                </div>
                {tabItems.map((item) => (
                    <Expand
                        className="tab-mobile"
                        expanded={activeTab === item.value}
                        onClick={(v) => setActiveTab(v ? item.value : -1)}
                        linkText={item.text}
                        key={'tabitem' + item.value}
                    >
                        {tabItemsContent[item.value]}
                    </Expand>
                ))}
            </ContentContainer>
        </div>
    );
}

export default connect((state: RootStoreState) => ({
    exchangeList: state.exchange.list,
}))(SectionTabs);
