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
import HeroMountainImageUrl from 'src/assets/images/hero-mountain.png';
import { Row } from 'antd';
import './SectionAbout.less';

export default function HomePage(): JSX.Element {
    return (
        <div className="section section-1">
            <ContentContainer>
                <div className="content">
                    <h2>
                        We’ve built a new economy: decentralized, distributed,
                        and digital. Now, it belongs to you.
                    </h2>
                    <div>
                        <p>
                            On June 16th, 2014, “UtopianFuture” painted a vision
                            for a new blockchain protocol based on three key
                            principles: decentralization, financial freedom, and
                            equality of opportunity.
                        </p>
                        <p>
                            On March 31st, 2015, a team of psuedonymous
                            developers banded together to launch NEM - the New
                            Economy Movement.
                        </p>
                        <p>
                            NEM launched with key features that helped it become
                            a pioneer in the blockchain landscape: native
                            multisignature accounts; namespaces; and mosaics.
                        </p>
                    </div>
                    <Row className="buttons">
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
    );
}
