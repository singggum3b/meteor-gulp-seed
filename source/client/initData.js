let initData= {
	siteRoutes: [
		{
			name: "Home",
			URL: "/",
			UIGroup: ["main-textmenu","footer-quicklink"]
		},
		{
			name: "Drivers",
			URL: "/drivers",
			UIGroup: ["main-textmenu","footer-quicklink"]
		},
		{
			name: "News",
			URL: "/news",
			UIGroup: ["main-textmenu","footer-quicklink"]
		},
		{
			name: "Calendar",
			URL: "/calendar",
			UIGroup: ["main-textmenu","footer-quicklink"]
		},
		{
			name: "FAQS",
			URL: "/faqs",
			UIGroup: ["footer-quicklink"]
		},
		{
			name: "Search",
			URL: "/drivers",
			UIGroup: ["main-iconmenu"]
		}
	],
	drivers: {
		countryFilter: [
			{
				title: "US",
				value: "us"
			},
			{
				title: "United Kingdom",
				value: "uk"
			},
			{
				title: "EU",
				value: "eu"
			},
			{
				title: "Russian",
				value: "rus"
			},
			{
				title: "Brazil",
				value: "br"
			}
		],
		championshipFilter : [
			{
				title: "BAza",
				value: "dss"
			},
			{
				title: "asasd",
				value: "asa"
			},
			{
				title: "Ruasaassian",
				value: "asa"
			},
			{
				title: "aaaa",
				value: "br"
			}
		],
		profiles: (process.env.NODE_ENV == "production") ? undefined : window.location.href.match(/magicLogin/) ? [{id: "1"}] : undefined
	},
	text: {
		"homeSubtitle1": "homeSubtitle1",
		"homeSubtitle2": "homeSubtitle2",
		"homeSubtitle3": "homeSubtitle3",
		"driversListSubtitle1": "driversListSubtitle1",
		"driversDetailNewsSubtitle": "driversDetailNewsSubtitle",
		"newsSubtitle1": "newsSubtitle1",
		"calendarSubtitle1": "calendarSubtitle1",
		"footerText1" : "footerText1",
		"driverPostNewsSubtitle1": "driverPostNewsSubtitle1"
	},
	alert: {
		"requiredField": "Please input required field(s)",
		"invalidEmailField": "The email you entered is incorrect",
		"invalidPasswordField": "You need to enter the confirm password or the password you entered is incorrect",
		"invalidLoginField": "The email or password you entered is incorrect"
	}
};

module.exports = {
	remote:initData,
	local: initData
};

