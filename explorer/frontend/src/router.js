import { BlocksPage, HomePage, TransactionsPage } from './pages';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export { BrowserRouter } from 'react-router-dom';

export const routerConfig = {
	routes: [
		{
			name: 'header_link_home',
			path: '/',
			exact: true,
			element: <HomePage />
		},
		{
			name: 'header_link_blocks',
			path: '/blocks',
			exact: false,
			element: <BlocksPage />
		},
		{
			name: 'header_link_transactions',
			path: '/transactions',
			exact: false,
			element: <TransactionsPage />
		}
	]
};

export const RouterView = () => {
	return (
		<Routes>
			{routerConfig.routes.map(route => (
				<Route
					name={route.name}
					path={route.path}
					exact={route.exact}
					element={route.element}
					key={'route' + route.name}
				/>
			))}
		</Routes>
	);
};
