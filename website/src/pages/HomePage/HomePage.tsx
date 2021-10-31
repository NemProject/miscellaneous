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
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { connect, RootStoreState } from 'src/store';
import BasePage from '../BasePage/BasePage';
import {
    Art,
    Button,
    Card,
    ContentContainer,
    HorizontalLine,
    Link,
    ModalBox,
    Tabs
} from 'src/components';
import HeroBuffaloImageUrl from 'src/assets/images/hero-buffalo.png';
import HeroCowImageUrl from 'src/assets/images/hero-cow.png';
import HeroDragonImageUrl from 'src/assets/images/hero-dragon.png';
import HeroElephantImageUrl from 'src/assets/images/hero-elephant.png';
import HeroLamaImageUrl from 'src/assets/images/hero-lama.png';
import HeroMountainImageUrl from 'src/assets/images/hero-mountain.png';
import HeroPhoenixImageUrl from 'src/assets/images/hero-phoenix.png';

import WatercolorBlueImageUrl from 'src/assets/images/watercolor-blue.png';
import WatercolorGoldImageUrl from 'src/assets/images/watercolor-gold.png';
import WatercolorGreenImageUrl from 'src/assets/images/watercolor-green.png';
import WatercolorPurpleImageUrl from 'src/assets/images/watercolor-purple.png';

import { Row } from 'antd';
import { RouteChildrenProps } from 'react-router-dom';
import './HomePage.less'

interface Props extends RouteChildrenProps {
}

function HomePage(props: Props): JSX.Element {
    const [activeTab, setActiveTab] = useState<number>(1);
    const [showModal, setShowModal] = useState<boolean>(false);

    const tabItems = [
        {
            text: 'Harvesting',
            value: 1
        },
        {
            text: 'Exchanges',
            value: 2
        },
        {
            text: 'Tokenomics',
            value: 3
        },
        {
            text: 'Supernode Program',
            value: 4
        },
    ];

    const watercolorImageUrl = ([
        WatercolorGreenImageUrl,
        WatercolorBlueImageUrl,
        WatercolorPurpleImageUrl,
        WatercolorGoldImageUrl,
    ])[activeTab - 1]

    const openModal = (index: number) => {
        setShowModal(true);
    };

    return (
        <BasePage>
            <div className="root">
                <div className="section section-1">
                    <ContentContainer>
                        <div className="content">
                            <h2>
                                We’ve built a new economy: decentralized, distributed, and digital. Now, it belongs to you.
                            </h2>
                            <div>
                                <p>
                                    On June 16th, 2014, “UtopianFuture” painted a vision for a new blockchain protocol based on three key principles: decentralization, financial freedom, and equality of opportunity.
                                </p>
                                <p>
                                    On March 31st, 2015, a team of psuedonymous developers banded together to launch NEM - the New Economy Movement. 
                                </p>
                                <p>
                                    NEM launched with key features that helped it become a pioneer in the blockchain landscape: native multisignature accounts; namespaces; and mosaics. 
                                </p>
                            </div>
                            <Row>
                                <Button>Start building</Button>
                                <Button>Join discord</Button>
                            </Row>
                        </div>
                        <Art 
                            className="hero-image-container" 
                            imageClassName="hero-image"
                            src={HeroMountainImageUrl} 
                        />
                    </ContentContainer>
                </div>
                <div className="section section-2">
                    <ContentContainer>
                        <Art 
                            className="hero-image-container" 
                            imageClassName="hero-image"
                            linkText="The Alpaca  |  By Maho"
                            src={HeroLamaImageUrl} 
                        />
                        <div className="content">
                            <h3>
                                Noteworthy Features
                            </h3>
                            <div>
                                <p>
                                    Many banks around the world have come to accept the importance of blockchain technology. In fact, a good number of banks in the U.S, India and Japan have already started using the technology. 
                                </p>
                                <p>
                                    Because banks generally employ the smart contract concept, NEM’s platform which is asset-friendly can be used to settle any asset. In settling assets, speed, security, and reliability are very important to a mainstream institution which is what this crypto offers. 
                                </p>
                                <p>
                                    NEM addresses these issues by repackaging its blockchain into a rivate chain and presenting it as Mijin.
                                </p>
                                <p>
                                    NEM crypto is also applicable in the technology world. Unlike Bitcoin and Dogecoin which use mining to increase the number of coins, XEM uses something called ‘harvesting’. In this process, blocks are generated and a person is rewarded for work contributed using transaction fees. Every block has a certain number of transactions which attract an unknown amount of fees. 
                                </p>
                            </div>
                            <Row>
                                <Button>Documentation</Button>
                            </Row>
                        </div>
                    </ContentContainer>
                </div>
                <div className="section section-3" active-title={activeTab}>
                    <img src={watercolorImageUrl} className="image-watercolor" />
                    <ContentContainer>
                        <div className="tabs-wrapper">
                            <Tabs items={tabItems} value={activeTab} onChange={(value) => setActiveTab(value as number)} />
                            {activeTab === 1 && (
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
                                </div>
                            )}
                            {activeTab === 2 && (
                                <div className="section-3-tab section-3-tab-2">
                                    <div className="content">
                                        <h3>
                                            Exchanges That Support The XEM Token
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
                                        src={HeroCowImageUrl} 
                                    />
                                </div>
                            )}
                            {activeTab === 3 && (
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
                                </div>
                            )}
                            {activeTab === 4 && (
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
                            )}
                        </div>
                    </ContentContainer>
                </div>
                <div className="section section-4">
                    <ContentContainer>
                        <Art 
                            className="hero-image-container" 
                            imageClassName="hero-image"
                            linkText="The Phoenix  |  By Maho"
                            src={HeroPhoenixImageUrl} 
                        />
                        <div className="content">
                            <h3>
                                What’s on the horizon
                            </h3>
                            <div>
                                <p>
                                    Many banks around the world have come to accept the importance of blockchain technology. In fact, a good number of banks in the U.S, India and Japan have already started using the technology. 
                                </p>
                                <p>
                                    Because banks generally employ the smart contract concept, NEM’s platform which is asset-friendly can be used to settle any asset. In settling assets, speed, security, and reliability are very important to a mainstream institution which is what this crypto offers. NEM addresses these issues by repackaging its blockchain into a rivate chain and presenting it as Mijin.
                                </p>
                                <p>
                                    NEM crypto is also applicable in the technology world. Unlike Bitcoin and Dogecoin which use mining to increase the number of coins, XEM uses something called ‘harvesting’. In this process, blocks are generated and a person is rewarded for work contributed using transaction fees. Every block has a certain number of transactions which attract an unknown amount of fees. 
                                </p>
                            </div>
                            <Row>
                                <Button>Learn More</Button>
                            </Row>
                        </div>
                    </ContentContainer>
                </div> 
                
            </div>
            <ModalBox
                visible={showModal}
                onClose={() => setShowModal(false)}
            >
            </ModalBox>
        </BasePage>
    );
}

export default connect((state: RootStoreState) => ({
}))(HomePage);
