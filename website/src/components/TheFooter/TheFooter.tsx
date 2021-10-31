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
    NemLogo
} from 'src/components';
import './TheFooter.less';

export const TheFooter = (): JSX.Element => {

    return (
        <div className="footer">
            <Row justify="center">
                <ContentContainer className="footer-content-container">
                    <NemLogo className="footer-symbol-logo" />
                    <div className="footer-section">
                        <h3 className="footer-section-title">NAVIGATION</h3>
                        <div className="footer-section-item">Home</div>
                        <div className="footer-section-item">Enterprise</div>
                        <div className="footer-section-item">Developers</div>
                        <div className="footer-section-item">XYM</div>
                        <div className="footer-section-item">Latest</div>
                        <div className="footer-section-item">Contact</div>
                    </div>
                    <div className="footer-section">
                        <h3 className="footer-section-title">DISCOVER</h3>
                        <div className="footer-section-item">About</div>
                        <div className="footer-section-item">Press and Media</div>
                        <div className="footer-section-item">SI Partner Program</div>
                        <div className="footer-section-item">Symbol FAQs</div>
                        <div className="footer-section-item">NEM Blog</div>
                        <div className="footer-section-item">NEM Forum</div>
                        <div className="footer-section-item">NEM Ecosystem</div>
                        <div className="footer-section-item">NEM NIS1</div>
                    </div>
                    <div className="footer-section">
                        <h3 className="footer-section-title">RESOURCES</h3>
                        <div className="footer-section-item">Hackathon</div>
                        <div className="footer-section-item">Webinar</div>
                        <div className="footer-section-item">Video Tutorials</div>
                        <div className="footer-section-item">XYM</div>
                        <div className="footer-section-item">Latest</div>
                        <div className="footer-section-item">Contact</div>
                    </div>
                </ContentContainer>
            </Row>
        </div>
    );
}
