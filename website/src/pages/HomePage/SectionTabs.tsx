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
    Expand,
    Tabs
} from 'src/components';
import HeroBuffaloImageUrl from 'src/assets/images/hero-buffalo.png';
import HeroCowImageUrl from 'src/assets/images/hero-cow.png';
import HeroDragonImageUrl from 'src/assets/images/hero-dragon.png';
import HeroElephantImageUrl from 'src/assets/images/hero-elephant.png';
import WatercolorBlueImageUrl from 'src/assets/images/watercolor-blue.png';
import WatercolorGoldImageUrl from 'src/assets/images/watercolor-gold.png';
import WatercolorGreenImageUrl from 'src/assets/images/watercolor-green.png';
import WatercolorPurpleImageUrl from 'src/assets/images/watercolor-purple.png';
import './SectionTabs.less'

interface Props {
    exchangeList: RootStoreState['exchange']['list'];
}

function SectionTabs(props: Props): JSX.Element {
    const { exchangeList } = props;
    const [activeTab, setActiveTab] = useState<number>(0);

    const watercolorImageUrl = ([
        WatercolorGreenImageUrl,
        WatercolorBlueImageUrl,
        WatercolorPurpleImageUrl,
        WatercolorGoldImageUrl,
    ])[activeTab - 1];

    const tabItems = [
        {
            text: 'Harvesting',
            value: 0
        },
        {
            text: 'Exchanges',
            value: 1
        },
        {
            text: 'Tokenomics',
            value: 2
        },
        {
            text: 'Supernode Program',
            value: 3
        },
    ];

    const tabItemsContent: Array<JSX.Element> = [
        <div className="section-3-tab section-3-tab-1">
            <div className="content">
                <h3>
                    Harvesting the NEM Token
                </h3>
                <div>
                    <p>
                        The process of creating new blocks and adding them to the blockchain is called Harvesting in Symbol.
                    </p>
                    <p>
                        Harvesting nodes commit hardware resources to maintaining the Symbol network and their owning accounts are rewarded XYM tokens for each harvested block. In order to harvest, accounts must hold a minimum of 10’000 XYM.
                    </p>
                    <p>
                        Node owners with insufficient balance can benefit from delegated harvesting and split the harvesting rewards with an account providing the required minimum balance. A profitable arrangement for both accounts!
                    </p>
                </div>
            </div>
            <Art 
                className="hero-image-container" 
                imageClassName="hero-image"
                src={HeroBuffaloImageUrl} 
            />
        </div>,
        <div className="section-3-tab section-3-tab-2">
            <div className="content">
                <h3>
                    Exchanges That Support The XEM Token
                </h3>
                <div className="image-container">
                    {exchangeList.map((exchange, index) => (
                        <a 
                            href={exchange.url}
                            key={'exchange' + index} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <img 
                                src={exchange.imageSrc}
                                className="image-exchange" 
                            />
                        </a>
                    ))}
                </div>
            </div>
            <Art 
                className="hero-image-container" 
                imageClassName="hero-image"
                src={HeroCowImageUrl} 
            />
        </div>,
        <div className="section-3-tab section-3-tab-3">
            <div className="content">
                <h3>
                    The XEM Tokenomics
                </h3>
                <div>
                    <p>
                        The process of creating new blocks and adding them to the blockchain is called Harvesting in Symbol.
                    </p>
                    <p>
                        Harvesting nodes commit hardware resources to maintaining the Symbol network and their owning accounts are rewarded XYM tokens for each harvested block. In order to harvest, accounts must hold a minimum of 10’000 XYM.
                    </p>
                    <p>
                        Node owners with insufficient balance can benefit from delegated harvesting and split the harvesting rewards with an account providing the required minimum balance. A profitable arrangement for both accounts!
                    </p>
                </div>
            </div>
            <Art 
                className="hero-image-container" 
                imageClassName="hero-image"
                src={HeroDragonImageUrl} 
            />
        </div>,
        <div className="section-3-tab section-3-tab-4">
            <div className="content">
                <h3>
                    Join the NEM Supernode Program
                </h3>
                <div>
                    <p>
                        The process of creating new blocks and adding them to the blockchain is called Harvesting in Symbol.
                    </p>
                    <p>
                        Harvesting nodes commit hardware resources to maintaining the Symbol network and their owning accounts are rewarded XYM tokens for each harvested block. In order to harvest, accounts must hold a minimum of 10’000 XYM.
                    </p>
                    <p>
                        Node owners with insufficient balance can benefit from delegated harvesting and split the harvesting rewards with an account providing the required minimum balance. A profitable arrangement for both accounts!
                    </p>
                </div>
            </div>
            <Art 
                className="hero-image-container" 
                imageClassName="hero-image"
                src={HeroElephantImageUrl} 
            />
        </div>
    ];

    return (
        <div className="section section-3" active-title={activeTab}>
            <img src={watercolorImageUrl} className="image-watercolor" />
            <ContentContainer>
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
    exchangeList: state.exchange.list
}))(SectionTabs);
