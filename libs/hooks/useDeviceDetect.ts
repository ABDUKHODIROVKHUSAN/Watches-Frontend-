import { useEffect, useState } from 'react';

const useDeviceDetect = () => {
	const [device, setDevice] = useState<string>('desktop');

	useEffect(() => {
		const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
		const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));
		if (mobile) setDevice('mobile');
		else setDevice('desktop');
	}, []);

	return device;
};

export default useDeviceDetect;
