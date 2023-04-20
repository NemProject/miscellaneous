import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, RouterView } from './router';
import { BasePage } from './pages';
import './styles/main.scss';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <BasePage>
                <RouterView />
            </BasePage>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
