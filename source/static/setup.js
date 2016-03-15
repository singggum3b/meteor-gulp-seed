/**
 * Created by singgum3b on 1/13/16.
 */
module.exports = {
	device: [
		{
			name: "phone",
			breakpoint: "640"
		},
		{
			name: "tablet",
			breakpoint: "1024"
		},
		{
			name: "desktop",
			breakpoint: Infinity
		}
	],
	route: [
		{
			name: "Home",
			URL: "/",
			initData: {}
		},
		{
			name: "Customer",
			URL: "/customer",
			initData: {}
		}
	]
};
