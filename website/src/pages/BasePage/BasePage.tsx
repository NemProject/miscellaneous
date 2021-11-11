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

import React, { Component } from 'react';
import { TheHeader, TheFooter } from 'src/components';
import './BasePage.less';

class BasePage extends Component {
    render(): JSX.Element {
        const { children } = this.props;

        return (
            <div className="base-page">
                <TheHeader />
                <div className="base-page-content">{children}</div>
                <TheFooter />
            </div>
        );
    }
}

export default BasePage;
