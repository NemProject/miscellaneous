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
import BasePage from '../BasePage/BasePage';
import './HomePage.less'
import SectionAbout from './SectionAbout';
import SectionDocumentation from './SectionDocumentation';
import SectionHorizon from './SectionHorizon';
import SectionTabs from './SectionTabs';

export default function HomePage(): JSX.Element {
    return (
        <BasePage>
            <div className="root">
                <SectionAbout />
                <SectionDocumentation />
                <SectionTabs />
                <SectionHorizon />
            </div>
        </BasePage>
    );
}
