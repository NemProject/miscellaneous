import {Footer, Header} from '../../components';
import React from 'react';
import './BasePage.scss';

export const BasePage = props => {
	const {children} = props;

	return (
		<div className="base-page">
			<Header/>
			<div className="base-page-content">
				{children}
			</div>
			<Footer/>
		</div>
	);
};
