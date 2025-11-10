import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return {
		performerId: params.id
	};
};
