import config from '../config';
import React from 'react';

/**
 * Generate paragraph layout from text string
 * @param {string} str - text string
 * @param {string} className - class name to be assigned to each paragraph
 * @returns {JSX} JSX element which contains generated paragraph layout
 */
export const createParagraph = (str, className) => {
	const paragraphs = str.split('\n');
	const reactParagraphs = paragraphs.map((paragraph, index) =>
		React.createElement('p', { className, key: 'p' + index }, paragraph));

	return React.createElement(React.Fragment, {}, reactParagraphs);
};

/**
 * Returns text or formatted null value
 * @param {string | null} value - text string or null value
 * @returns {string} formatted value
 */
export const formatNullableText = value => {
	return null === value ? '-' : value;
};

/**
 * Format date string
 * @param {string} dateStr - date string
 * @param {function} translate - translate function
 * @param {boolean} showTime - include time value
 * @param {boolean} showSeconds - include seconds in time value
 * @returns {string} formatted date string
 */
export const formatDate = (
	dateStr,
	translate,
	showTime = false,
	showSeconds = true
) => {
	const months = [
		'jan',
		'feb',
		'mar',
		'apr',
		'may',
		'jun',
		'jul',
		'aug',
		'sep',
		'oct',
		'nov',
		'dec'
	];

	const addZero = num => {
		return 0 <= num && 10 > num ? '0' + num : num + '';
	};

	const dateObj = new Date(dateStr);
	const seconds = addZero(dateObj.getSeconds());
	const minutes = addZero(dateObj.getMinutes());
	const hour = addZero(dateObj.getHours());
	const month =
    'function' === typeof translate
    	? translate('month_' + months[dateObj.getMonth()])
    	: months[dateObj.getMonth()];
	const day = dateObj.getDate();
	const year = dateObj.getFullYear();

	let formattedDate = `${month} ${day}, ${year}`;

	formattedDate += showTime ? ` ${hour}:${minutes}` : '';
	formattedDate += showTime && showSeconds ? `:${seconds}` : '';

	return formattedDate;
};

/**
 * Converts number to shorter nonation. Ex. "1230000" => "1.23M"
 * @param {number} num - numeric value
 * @returns {string} shorter string number string
 */
export const numberToShortString = num => {
	const value = num.toString().replace(/[^0-9.]/g, '');

	if (1000 > value) 
		return '' + value;

	let si = [
		{ v: 1e3, s: 'K' },
		{ v: 1e6, s: 'M' }
	];

	let index;
	for (index = si.length - 1; 0 < index; --index)
	{if (value >= si[index].v) 
		break;}

	return (
		(value / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') +
    si[index].s
	);
};

/**
 * Constructs query string
 * @param {object.<string, string | number | boolean>} data - query parameters in key-value record object.
 * @returns {string} query string
 */
export const encodeQueryParams = data => {
	const params = [];

	for (const key in data) {
		const value = data[key];
		if (
			'boolean' === typeof value ||
			'number' === typeof value ||
			'string' === typeof value
		)
			params.push(`${key}=${value}`);
	}

	return params.join('&');
};

/**
 * Constructs query string
 * @param {string} method - a string to set request's method
 * @param {string} url - endpoint url to fetch
 * @param {object.<any>} [body] - optional body parameter
 * @returns {Promise.<any>} response
 */
export const makeRequest = (method, url, body) => {
	return fetch(url, {
		method,
		...(body && { body: JSON.stringify(body) })
	});
};

/**
 * Localized relative time formatting
 * @param {number} time - time in seconds
 * @param {function} translate - translate function
 * @returns {string} relative time
 */
export const timeSince = (time, translate) => {
	const { NEM_EPOCH } = config;
	const nowTime = Date.now();

	const second = Math.floor((nowTime - NEM_EPOCH - (time * 1000)) / 1000);

	if (60 > second)
		return `${second} ${translate('time_short_seconds')} ${translate('time_ago')}`;

	const minute = Math.floor(second / 60);

	if (60 > minute)
		return `${minute} ${translate('time_short_minutes')} ${translate('time_ago')}`;

	const hour = Math.floor(minute / 60);

	if (24 > hour)
		return `${hour} ${translate('time_short_hours')} ${translate('time_ago')}`;

	const day = Math.floor(hour / 24);

	return `${day} ${translate('time_short_days')} ${translate('time_ago')}`;
};
