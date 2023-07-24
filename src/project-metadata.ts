const META_DATA = {
	next: {
		pageAndLayoutMatcher: '**/{page,layout}.{tsx,jsx}',
	 	basePathMatcher: /\/app\/.*/g
	},
	svelteKit: {},
	qwikCity: {},
	nuxt: {}
};

export function getProjectMetadata () {
	return META_DATA['next'];
}