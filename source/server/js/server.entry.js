var API = new Restivus({
	apiPath: "",
	prettyJson: true
});

//==================================
const isRemote = process.env.REMOTE;
var remoteServer = "http://clubf4.demo.pycogroup.com";
//==================================
var R = require("superagent-defaults")().set("Accept", "application/json");

function syncRequest(handler) {
	return Meteor.wrapAsync(handler.bind(this,R))();
}

//==================================

API.addRoute('/api/news/feed', {authRequired: false}, {
	get: function () {
		let query = this.queryParams;
		if (isRemote) {
			try {
				return syncRequest(function (R, cb) {
					R.get(`${remoteServer}/api/news/feed`)
							.query(query)
							.end((err, res)=> {
								cb(err, res);
							});
				}).body;
			} catch(e) {
				return [];
			}

		} else {
			return query.pager == 0 ? [
				{
					pager: query.pager,
					type: query.type,
					pagesize: query.pagesize
				},
				{
					id: 1,
					type: "video",
					video: "#ac",
					sourceName: "john",
					sourceURL: "#",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQtbGl9ZSwdcvp3dJ2kz-GyNguZ20ruSWV3qmq6nczXlJxOw9kp",
					timeline: " 4 hour ago",
					title: "News 1",
					summary: "SUmmary 1"
				},
				{
					id: 2,
					type: "article",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQtbGl9ZSwdcvp3dJ2kz-GyNguZ20ruSWV3qmq6nczXlJxOw9kp",
					sourceName: "john",
					sourceURL: "#",
					timeline: " 4 hour ago",
					title: "News 1",
					summary: "SUmmary 1 HTML"
				},
				{
					id: 3,
					type: "facebook",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQtbGl9ZSwdcvp3dJ2kz-GyNguZ20ruSWV3qmq6nczXlJxOw9kp",
					sourceName: "john",
					sourceURL: "#",
					timeline: " 4 hour ago",
					title: "News 1",
					summary: "SUmmary 1 HTML content",
					liked: 20
				},
				{
					id: 4,
					type: "instagram",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQtbGl9ZSwdcvp3dJ2kz-GyNguZ20ruSWV3qmq6nczXlJxOw9kp",
					sourceName: "john",
					sourceURL: "#",
					timeline: " 4 hour ago",
					title: "News 1",
					summary: "SUmmary 1 HTML"
				},
				{
					id: 5,
					type: "twitter",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQtbGl9ZSwdcvp3dJ2kz-GyNguZ20ruSWV3qmq6nczXlJxOw9kp",
					sourceName: "john",
					sourceURL: "#",
					timeline: " 4 hour ago",
					title: "News 1",
					summary: "SUmmary 1 HTML",
					retwitted: 20,
					favoured: 13
				}
			] : [
				{
					pager: query.pager,
					type: query.type,
					pagesize: query.pagesize
				},
				{
					video: "#ac",
					id: 6,
					type: "video",
					sourceName: "john",
					sourceURL: "#",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQtbGl9ZSwdcvp3dJ2kz-GyNguZ20ruSWV3qmq6nczXlJxOw9kp",
					timeline: " 4 hour ago",
					title: "News 1",
					summary: "SUmmary 1"
				},
				{
					id: 7,
					type: "article",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQtbGl9ZSwdcvp3dJ2kz-GyNguZ20ruSWV3qmq6nczXlJxOw9k",
					sourceName: "john",
					sourceURL: "#",
					timeline: " 4 hour ago",
					title: "News 1",
					summary: "SUmmary 1 HTML"
				},
				{
					id: 8,
					type: "facebook",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQtbGl9ZSwdcvp3dJ2kz-GyNguZ20ruSWV3qmq6nczXlJxOw9kp",
					sourceName: "john",
					sourceURL: "#",
					timeline: " 4 hour ago",
					title: "News 1",
					summary: "SUmmary 1 HTML content",
					liked: 20
				},
				{
					id: 9,
					type: "instagram",
					photo: "http://fbwhatsappstatusdp.com/wp-content/uploads/2015/09/beautiful_beach_sunsets_wallpaper_hd_free.jpg",
					sourceName: "john",
					sourceURL: "#",
					timeline: " 4 hour ago",
					title: "News 1",
					summary: "SUmmary 1 HTML"
				},
				{
					id: 10,
					type: "twitter",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQtbGl9ZSwdcvp3dJ2kz-GyNguZ20ruSWV3qmq6nczXlJxOw9k",
					sourceName: "john",
					sourceURL: "#",
					timeline: " 4 hour ago",
					title: "News 1",
					summary: "SUmmary 1 HTML",
					retwitted: 20,
					favoured: 13
				}
			]
		}
	}
});

API.addRoute('/api/drivers/driver', {authRequired: false}, {
	get: function () {
		let query = this.queryParams;
		if (isRemote) {
			try {
				return syncRequest(function (R, cb) {
					R.get(`${remoteServer}/api/drivers/driver`)
							.query(query)
							.end((err, res)=> {
								cb(err, res);
							});
				}).body;
			} catch(e) {
				return [];
			}

		} else {
			return [
				{
					pager: query.pager || 0,
					type: query.type,
					pagesize: query.pagesize || 10
				},
				{
					id: 0,
					isNew: false,
					name: "Magna Pellentesque Ultricies Pharetra Lorem",
					biography: "Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec ullamcorper nulla non metus auctor frii. Curabitur blandit tempus porttitor.",
					team: "agi sport",
					URL: "#",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQtbGl9ZSwdcvp3dJ2kz-GyNguZ20ruSWV3qmq6nczXlJxOw9kp",
					country: {
						name: "Jordan",
						flagImage: "http://icons.iconarchive.com/icons/custom-icon-design/flag-2/256/France-Flag-icon.png"
					}
				},
				{
					id: 1,
					isNew: false,
					name: "Magna Pellentesque Ultricies Pharetra Lorem",
					biography: "Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec ullamcorper nulla non metus auctor frii. Curabitur blandit tempus porttitor.",
					team: "agi sport",
					URL: "#",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQtbGl9ZSwdcvp3dJ2kz-GyNguZ20ruSWV3qmq6nczXlJxOw9kp",
					country: {
						name: "Jordan",
						flagImage: "http://icons.iconarchive.com/icons/custom-icon-design/flag-2/256/France-Flag-icon.png"
					}
				},
				{
					id: 2,
					isNew: false,
					name: "Magna Pellentesque Ultricies Pharetra Lorem",
					biography: "Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec ullamcorper nulla non metus auctor frii. Curabitur blandit tempus porttitor.",
					team: "bb sport",
					URL: "#",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQtbGl9ZSwdcvp3dJ2kz-GyNguZ20ruSWV3qmq6nczXlJxOw9kp",
					country: {
						name: "Jordan",
						flagImage: "http://icons.iconarchive.com/icons/custom-icon-design/flag-2/256/France-Flag-icon.png"
					}
				},
				{
					id: 3,
					isNew: true,
					name: "Magna Pellentesque Ultricies Pharetra Lorem",
					biography: "Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec ullamcorper nulla non metus auctor frii. Curabitur blandit tempus porttitor.",
					team: "bj sport",
					URL: "#",
					photo: "http://formula1.sporting99.com/pic/lewis-hamilton.jpg",
					country: {
						name: "Jordan",
						flagImage: "http://icons.iconarchive.com/icons/custom-icon-design/flag-2/256/France-Flag-icon.png"
					}
				},
				{
					id: 4,
					isNew: false,
					name: "Magna Pellentesque Ultricies Pharetra Lorem",
					biography: "Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec ullamcorper nulla non metus auctor frii. Curabitur blandit tempus porttitor.",
					team: "bb sport",
					URL: "#",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQoPH-tR34Pqax1857kf6K4QzmQDrrSi9gsBYK6pQ6T8FoeEkyaYg",
					country: {
						name: "Jordan",
						flagImage: "http://icons.iconarchive.com/icons/custom-icon-design/flag-2/256/France-Flag-icon.png"
					}
				},
				{
					id: 5,
					isNew: false,
					name: "Magna Pellentesque Ultricies Pharetra Lorem",
					biography: "Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec ullamcorper nulla non metus auctor frii. Curabitur blandit tempus porttitor.",
					team: "agi sport",
					URL: "#",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQtbGl9ZSwdcvp3dJ2kz-GyNguZ20ruSWV3qmq6nczXlJxOw9kp",
					country: {
						name: "Jordan",
						flagImage: "http://icons.iconarchive.com/icons/custom-icon-design/flag-2/256/France-Flag-icon.png"
					}
				},
				{
					id: 6,
					isNew: false,
					name: "Magna Pellentesque Ultricies Pharetra Lorem",
					biography: "Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec ullamcorper nulla non metus auctor frii. Curabitur blandit tempus porttitor.",
					team: "bb sport",
					URL: "#",
					photo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQoPH-tR34Pqax1857kf6K4QzmQDrrSi9gsBYK6pQ6T8FoeEkyaYg",
					country: {
						name: "Jordan",
						flagImage: "http://icons.iconarchive.com/icons/custom-icon-design/flag-2/256/France-Flag-icon.png"
					}
				}

			];
		}
	}
});

API.addRoute('/api/drivers/driver/:id', {authRequired: false}, {
	get: function () {
		let query = this.queryParams;
		let param = this.urlParams;

		if (isRemote) {
			try {
				return syncRequest(function (R, cb) {
					R.get(`${remoteServer}//api/drivers/driver/${param.id}`)
							.query(query)
							.end((err, res)=> {
								cb(err, res);
							});
				}).body;
			} catch(e) {
				return [];
			}

		} else {
			return [
				{
					id: "122",
					profile: {
						photo: "http://www.adac-motorsport.de/images/270/338/0665862.jpg",
						table: [
							["Name", "Birthdate", "Nationality", "Hometown", "Biography"],
							["Kim-Luis Schramm", "1977.07.21", "DEU", "Wümbach", "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source"]
						],
						facebookURL: "#f",
						twitterURL: "#t",
						youtubeURL: "#y"
					},
					highlight: {
						title: "F4 Hightlights",
						table: [
							["Best Classification", "Races", "Victories", "Podiums", "Best position", "Points", "Poles", "Fastest laps", "Distance"],
							[13, 24, 0, 1, "3 (:goldcup)", 70, 0, 0, "1353.904 KM"]
						]
					},
					statistic: [
						{
							id: 1,
							name: "ADAC F4 Germany Championship 2015",
							logo: "http://www.adac-motorsport.de/img/adac-formel-4-logo.jpg",
							overviewTable: [
								["Chasis", "Engine", "Tyres", "Overall Classification", "Races", "Victories", "Podiums", "Best position", "Points", "Poles", "Fastest laps", "Distance"],
								["Tatuus", "Abarth", "Pirelli", 13, 24, "0-0%", "1-4%", "3 (:goldcup)", 70, "0-0%", "0-0%", "1353.904 KM"]
							],
							events: [
								{
									id: 1,
									name: "Sachsenring",
									timeline: "8/28/2015",
									summaryTable: [
										["Circuit", "Length", "Age", "Team name"],
										["Sachsenring", "3.645 KM", 16, "Neuhauser Racing"]
									],
									resultTable: [
										["", "Position", "Points", "Pole Position", "Fastest Lap", "Best Lap", "Best Sector 1", "Best Sector 2", "Best Sector 3", "Best Sector 4", "Number Of Laps", "Distance"],
										["Race 1", 9, 2, "No", "No", "1:21.361", "41.998", "17.827", "21.491", "-", 19, "69.255 KM"],
										["Race 2", 4, 12, "No", "No", "1:21.175", "41.824", "17.783", "21.483", "-", 15, "54.675 KM"],
										["Race 3", 3, 15, "No", "No", "1:21.726", "41.92", "17.94", "21.616", "-", 18, "65.610 KM"]
									],
									totalTable: [
										["Best position", "Points", "Poles", "Fastest laps", "Distance"],
										[3, 29, 0 , 0 , "1'23.234''", 52, "189.540 KM"]
									]
								},
								{
									id: 2,
									name: "Hockenheim",
									timeline: "10/2/2015",
									summaryTable: [
										["Circuit", "Length", "Age", "Team name"],
										["Hockenheimring", "4.574 KM", 18, "Neuhauser Racing"]
									],
									resultTable: [
										["", "Position", "Points", "Pole Position", "Fastest Lap", "Best Lap", "Best Sector 1", "Best Sector 2", "Best Sector 3", "Best Sector 4", "Number Of Laps", "Distance"],
										["Race 1", 14, 0, "No", "No", "1:42.132", "22.402", "48.393", "31.232", "-", 17, "77.758 KM"],
										["Race 2", "DNF", 0, "No", "No", "1:45.018", "", "", "", "-", 9, "41.166 KM"],
										["Race 3", 5, 10, "No", "No", "1:44.768", "22.94", "49.254", "31.778", "-", 11, "50.314 KM"]
									],
									totalTable: [
										["Best position", "Points", "Poles", "Fastest laps", "Distance"],
										[5, 10, 0 , 0 , "1'23.234''", 37, "169.238 KM"]
									]
								}

							]
						}
					]
				}
			];
		}
	}
});

API.addRoute('api/event/calendar', {authRequired: false}, {
	get: function () {
		let query = this.queryParams;
		if (isRemote) {
			try {
				return syncRequest(function (R, cb) {
					R.get(`${remoteServer}/api/event/calendar`)
							.query(query)
							.end((err, res)=> {
								cb(err, res);
							});
				}).body;
			} catch(e) {
				return [];
			}

		} else {
			return [
				{
					pager: query.pager,
					type: query.type,
					pagesize: query.pagesize
				},
				{
					id: 1,
					name: "event 1",
					photo: "http://tkart.it/wp-content/uploads/formula_4_logo.jpg",
					date: "29-30-31 Janvier",
					location: "F4mex -toluca",
					detailURL: "#"
				},
				{
					id: 2,
					name: "event 2",
					photo: "http://tkart.it/wp-content/uploads/formula_4_logo.jpg",
					date: "29-30-31 Janvier",
					location: "F4mex -toluca",
					detailURL: "#"
				},
				{
					id: 3,
					name: "event 3",
					photo: "http://tkart.it/wp-content/uploads/formula_4_logo.jpg",
					date: "29-30-31 Janvier",
					location: "F4mex -toluca",
					detailURL: "#"
				},
				{
					id: 4,
					name: "event 4",
					photo: "http://tkart.it/wp-content/uploads/formula_4_logo.jpg",
					date: "29-30-31 Janvier",
					location: "F4mex -toluca",
					detailURL: "#"
				},
				{
					id: 5,
					name: "event 5",
					photo: "http://tkart.it/wp-content/uploads/formula_4_logo.jpg",
					date: "29-30-31 Janvier",
					location: "F4mex -toluca",
					detailURL: "#"
				}
			];
		}
	}
});

API.addRoute('api/news/feed/:id', {authRequired: false}, {
	get: function () {
		let param = this.urlParams;

		if (isRemote) {
			try {
				return syncRequest(function (R, cb) {
					//console.log(param);
					R.get(`${remoteServer}/api/news/feed/${param.id}`)
							.end((err, res)=> {
								//console.log(err,res);
								cb(err, res);
							});
				}).body;
			} catch(e) {
				return [];
			}

		} else {
			return [
				{
					id: "1",
					title: "Article title",
					author: "Vehicula Bibendum Ligula",
					timeline: "01/13/2016",
					video: `<iframe src="https://player.vimeo.com/video/72963743" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`,
					image: "http://www.hdwallpapersnew.net/wp-content/uploads/2015/05/wonderful-6th-gear-racing-cars-widescreen-high-definition-wallpaper-free-images.jpg",
					summary: "Duplicate head changes preserved when specified in same component (support for tags like apple-touch-icon)",
					content: `<p>Racing Victoria’s trial of 30-minute gaps between races will continue indefinitely - but not on Saturdays.

The RV board has responded to the concerns of punters and participants, announcing the move late on Tuesday which means on Saturdays racing will return to the previously adopted national race times template.

After weeks of fighting with their counterparts at Racing NSW, the two have found some middle ground, agreeing to a coordinated six-month trial of 30-minute gaps between weekday metropolitan meetings in the two states. That trial will start on Wednesday, March 2.

RV, which started the trial on February 6, says it is seeking to engage with Sky Racing and other state authorities as a matter of priority to eliminate direct thoroughbred racing clashes Sunday through until Friday.

“We welcome the opportunity to conduct a coordinated trial of 30-minute gaps with New South Wales for their weekday metropolitan meetings and look forward to expanding this to include other states,” RV chairman David Moodie said.

“This is an important initiative for the industry nationally.

"</p><p><img src="http://www.hdwallpapersnew.net/wp-content/uploads/2015/05/wonderful-6th-gear-racing-cars-widescreen-high-definition-wallpaper-free-images.jpg">Sample image
</p><p>Whilst there has been plenty of positive feedback from all sectors of the industry on the benefits of reducing the gaps between races, we do acknowledge the valid concerns of some punters and participants around their experience on Saturdays thus far.

“We will continue with our trial on Sundays through Fridays, which will allow us to undertake more robust and accurate analysis of the impacts on wagering, operations, customer behaviour and the raceday experience over an expanded period.”

Racing NSW chairman John Messara is happy to be part of the trial.

“</p><p>This is a pleasing outcome for the racing industry, arrived at in collaboration with Racing Victoria,” he said.

As part of its ongoing review of the trial, RV will survey all owners, trainers and jockeys who have participated in the trial from Monday, February 22.

An initial survey of punters was conducted last week and further surveys will be conducted over coming weeks.</p>`
				}
			];
		}
	}
});


API.addRoute('api/page/:id', {authRequired: false}, {
	get: function () {
		let param = this.urlParams;

		if (isRemote) {
			try {
				return syncRequest(function (R, cb) {
					R.get(`${remoteServer}/api/page/${param.id}`)
							.end((err, res)=> {
								cb(err, res);
							});
				}).body;
			} catch(e) {
				return [];
			}

		} else {
			return [

				{
					id: "1",
					title: "Article title",
					summary: "Duplicate head changes preserved when specified in same component (support for tags like apple-touch-icon)",
					content: `<p>Racing Victoria’s trial of 30-minute gaps between races will continue indefinitely - but not on Saturdays.

The RV board has responded to the concerns of punters and participants, announcing the move late on Tuesday which means on Saturdays racing will return to the previously adopted national race times template.

After weeks of fighting with their counterparts at Racing NSW, the two have found some middle ground, agreeing to a coordinated six-month trial of 30-minute gaps between weekday metropolitan meetings in the two states. That trial will start on Wednesday, March 2.

RV, which started the trial on February 6, says it is seeking to engage with Sky Racing and other state authorities as a matter of priority to eliminate direct thoroughbred racing clashes Sunday through until Friday.

“We welcome the opportunity to conduct a coordinated trial of 30-minute gaps with New South Wales for their weekday metropolitan meetings and look forward to expanding this to include other states,” RV chairman David Moodie said.

“This is an important initiative for the industry nationally.

"</p><p><img src="http://www.hdwallpapersnew.net/wp-content/uploads/2015/05/wonderful-6th-gear-racing-cars-widescreen-high-definition-wallpaper-free-images.jpg">Sample image
</p><p>Whilst there has been plenty of positive feedback from all sectors of the industry on the benefits of reducing the gaps between races, we do acknowledge the valid concerns of some punters and participants around their experience on Saturdays thus far.

“We will continue with our trial on Sundays through Fridays, which will allow us to undertake more robust and accurate analysis of the impacts on wagering, operations, customer behaviour and the raceday experience over an expanded period.”

Racing NSW chairman John Messara is happy to be part of the trial.

“</p><p>This is a pleasing outcome for the racing industry, arrived at in collaboration with Racing Victoria,” he said.

As part of its ongoing review of the trial, RV will survey all owners, trainers and jockeys who have participated in the trial from Monday, February 22.

An initial survey of punters was conducted last week and further surveys will be conducted over coming weeks.</p>`
				}
			];
		}
	}
});

API.addRoute('api/driver/compare', {authRequired: false}, {
	get: function () {
		let param = this.urlParams;
		let query = this.queryParams;

		//console.log(query);
		if (isRemote) {
			try {
				return syncRequest(function (R, cb) {
					R.get(`${remoteServer}/api/driver/compare`)
						.query(query)
						.end((err, res)=> {
							//console.log(res.body);
							cb(err, res);
						});
				}).body;
			} catch(e) {
				return [];
			}

		} else {
			return require("../../client/js/data/sample-data").compareDriver;
		}
	}
});

API.addRoute('api/profile/user/login', {authRequired: false}, {
	post: function () {

		let param = this.bodyParams;
		console.log(param);

		if (isRemote) {
			let result;
			try {
				return syncRequest(function (R, cb) {
					R.post(`${remoteServer}/api/profile/user/login`)
						.send(param)
						.end((err, res)=> {
							cb(null,{
								statusCode: res.statusCode,
								body:res.body
							});
						});
				});

			} catch(e) {
				return [];
			}

		} else {
			return [];
		}
	}
});

API.addRoute('api/profile/user/request_new_password', {authRequired: false}, {
	post: function () {

		let param = this.bodyParams;
		console.log(param);

		if (isRemote) {
			let result;
			try {
				return syncRequest(function (R, cb) {
					R.post(`${remoteServer}/api/profile/user/request_new_password`)
						.send(param)
						.end((err, res)=> {
							cb(null,{
								statusCode: res.statusCode,
								body:res.body
							});
						});
				});

			} catch(e) {
				return [];
			}

		} else {
			return [];
		}
	}
});

API.addRoute('api/drivers/driver/postnews', {authRequired: false}, {
	post: function () {

		let param = this.bodyParams;
		console.log(param);

		if (isRemote) {
			let result;
			try {
				return syncRequest(function (R, cb) {
					R.post(`${remoteServer}/api/drivers/driver/postnews`)
						.send(param)
						.end((err, res)=> {
							cb(null,{
								statusCode: res.statusCode,
								body:res.body
							});
						});
				});

			} catch(e) {
				return [];
			}

		} else {
			return [];
		}
	}
});

API.addRoute('api/drivers/driver/reset_password', {authRequired: false}, {
	post: function () {

		let param = this.bodyParams;
		console.log(param);

		if (isRemote) {
			let result;
			try {
				return syncRequest(function (R, cb) {
					R.post(`${remoteServer}/api/drivers/driver/reset_password`)
						.send(param)
						.end((err, res)=> {
							cb(null,{
								statusCode: res.statusCode,
								body:res.body
							});
						});
				});

			} catch(e) {
				return [];
			}

		} else {
			return [];
		}
	}
});
