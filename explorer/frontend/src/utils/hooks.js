/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

export const useApi = (
	fetchFunction,
	args = [],
	defaultValue = undefined,
	onError = () => {}
) => {
	const [data, setData] = useState(defaultValue);
	const [isLoading, setIsLoading] = useState(null);

	useEffect(
		() =>
			(async () => {
				try {
					setIsLoading(true);
					const unsetData = await fetchFunction(...args);
					setData(unsetData);
				} catch (e) {
					onError(e);
				} finally {
					setIsLoading(false);
				}
			})(),
		[...args]
	);

	return [data, isLoading];
};
