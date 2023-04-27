import {BasePage} from './pages';
import {BrowserRouter, RouterView} from './router';
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<BasePage>
				<RouterView/>
			</BasePage>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);
