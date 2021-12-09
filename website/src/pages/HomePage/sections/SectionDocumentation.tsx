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
import './SectionDocumentation.less';

export default function SectionDocumentation(): JSX.Element {
    return (
        <div className="section section-2">
            <ContentContainer>
                <Art
                    className="hero-image-container"
                    imageClassName="hero-image"
                    linkText="The Alpaca  |  By Maho"
                    src={HeroLamaImageUrl}
                />
                <div className="content">
                    <h2>Noteworthy Features</h2>
                    <div>
                        <p>
                            Many banks around the world have come to accept the
                            importance of blockchain technology. In fact, a good
                            number of banks in the U.S, India and Japan have
                            already started using the technology.
                        </p>
                        <p>
                            Because banks generally employ the smart contract
                            concept, NEM’s platform which is asset-friendly can
                            be used to settle any asset. In settling assets,
                            speed, security, and reliability are very important
                            to a mainstream institution which is what this
                            crypto offers.
                        </p>
                        <p>
                            NEM addresses these issues by repackaging its
                            blockchain into a rivate chain and presenting it as
                            Mijin.
                        </p>
                        <p>
                            NEM crypto is also applicable in the technology
                            world. Unlike Bitcoin and Dogecoin which use mining
                            to increase the number of coins, XEM uses something
                            called ‘harvesting’. In this process, blocks are
                            generated and a person is rewarded for work
                            contributed using transaction fees. Every block has
                            a certain number of transactions which attract an
                            unknown amount of fees.
                        </p>
                    </div>
                    <Row>
                        <Button>Documentation</Button>
                    </Row>
                </div>
            </ContentContainer>
        </div>
    );
}
