var actionTypes = require("./constant").action;

let isProd = (process.env.NODE_ENV == "production");

var Store = new Nuclear.Store({
	getInitialState: function () {
		return Immutable.fromJS({
			login: Object.assign({
				meta: {
					isLoading: false,
					enableLoginPanel: true,
					forgotEmailSent : false
				}
			},initData.drivers.profiles ? initData.drivers.profiles[0] : {}),
			formDriverPostNews: {
				meta: {
					isLoading: false
				}
			},
			formResetPWD: {
				meta: {
					isLoading: false
				}
			},
			dialog: undefined,
			customerComment: "",
			customerName: "",
			siteRoutes: initData.siteRoutes,
			suggestionDrivers: {
				meta: {
					pager: 0,
					type: undefined,
					pagesize: undefined,
					hasMore: true,
					isLoading: false,
					nameFilter: undefined,
					filter: {
						name: undefined
					}
				},
				list: []
			},
			currentDriver: {
				meta: {
					isLoading: true,
					compareIDFilter: undefined
				}
			},
			compareDriver: {
				meta: {
					isLoading: false
				}
			},
			article: {
				meta: {
					isLoading: true
				}
			},
			drivers: {
				meta: {
					pager: 0,
					type: undefined,
					pagesize: undefined,
					hasMore: true,
					everLoaded: false,
					isLoading: false,
					nameFilter: undefined,
					championFilter: "",
					countryFilter: "",
					letterFilter: "",
					filter: {
						name: undefined,
						champion: [{title: "All championships", value: ""}].concat(initData.drivers.championshipFilter),
						country: [{title: "All countries", value: ""}].concat(initData.drivers.countryFilter)
					}
				},
				list: []
			},
			calendar: {
				meta: {
					pager: 0,
					type: undefined,
					pagesize: undefined,
					everLoaded: false,
					hasMore: true,
					isLoading: true
				},
				list: []
			},
			news: {
				meta: {
					pager: 0,
					type: undefined,
					pagesize: undefined,
					everLoaded: false,
					hasMore: true,
					isLoading: true,
					typeFilter: "",
					filter: {
						type: [
							{
								title: "All media",
								value: ""
							},
							{
								title: "News",
								value: "article"
							},
							{
								title: "Facebook",
								value: "facebook"
							},
							{
								title: "Twitter",
								value: "twitter"
							},
							{
								title: "Instagram",
								value: "instagram"
							}
						]
					}
				},
				list: []
			}
		});
	},
	initialize: function () {

		this.on(actionTypes.POST_FORM, function (state, payload) {
			if (payload) {
				return state.update(payload.target, function (old) {
					let _newState = old;
					let _alert = mdx(payload.statusCode, {
						200: ()=> {
							return {
								type: "info",
								message: payload.body
							}
						},
						404: ()=> {
							return {
								type: "error",
								message: "404 - POST URL not found"
							}
						}
					}, ()=> {
						return {
							type: "error",
							message: payload.body
						}
					});

					return _newState
						.setIn(["meta", "alert"], Immutable.fromJS(_alert))
						.setIn(["meta", "isLoading"],false);

				});
			} else return state;
		});

		this.on(actionTypes.LOGIN, function (state, payload) {
			if (payload) {
				return state.update("login", function (old) {
					let _newState = old;
					let _alert = mdx(payload.statusCode, {
						406: ()=> {
							return {
								type: "error",
								message: payload.body
							}
						},
						403: ()=> {
							return {
								type: "error",
								message: payload.body
							}
						},
						401: ()=> {
							return {
								type: "error",
								message: payload.body
							}
						},
						200: ()=> {
							window.location.href = "/";
							_newState = _newState.mergeDeep(Immutable.fromJS(payload.body.user[0])).setIn(["meta", "isLoading"], false);
							return undefined;
						}
					}, ()=> {
						return undefined;
					});

					return _newState.setIn(["meta", "alert"], Immutable.fromJS(_alert));

				});
			} else return state;
		});

		this.on(actionTypes.FORGOT_PASSWORD, function (state, payload) {
			if (payload) {
				return state.update("login", function (old) {
					let _newState = old;
					let _alert = mdx(payload.statusCode, {
						200: ()=> {
							_newState = _newState.setIn(["meta", "forgotEmailSent"],true);
							return  {
								type: "info",
								message: payload.body
							};
						}
					}, ()=> {
						return {
							type: "error",
							message: payload.body
						};
					});

					return _newState.setIn(["meta", "alert"], Immutable.fromJS(_alert));

				});
			} else return state;
		});

		this.on(actionTypes.MODIFY_META, function (state, payload) {
			if (payload) {
				return state.update(payload.target, function (old) {
					return old.setIn(["meta",payload.entry],payload.value);
				});
			} else return state;
		});


		this.on(actionTypes.LOGOUT, function (state, payload) {
			if (payload) {
				return state.update("login", function (old) {
					let _newState = old;
					mdx(payload.statusCode, {
						200: ()=> {
							window.location.href = "/";
						}
					}, ()=> {
						return undefined;
					});

					return _newState

				});
			} else return state;
		});

		this.on(actionTypes.GET_ARTICLE, function (state, payload) {
			if (payload) {
				return state.update("article", function (old) {
					return old.mergeDeep(Immutable.fromJS(payload)).setIn(["meta", "isLoading"], false);
				});
			} else return state;
		});

		this.on(actionTypes.GET_DRIVER_DETAIL, function (state, payload) {
			if (payload) {
				return state.update("currentDriver", function (old) {
					return old.mergeDeep(Immutable.fromJS(payload)).setIn(["meta", "isLoading"], false);
				});
			} else return state;
		});

		this.on(actionTypes.GET_DRIVER_COMPARE, function (state, payload) {
			if (payload) {
				return state.update("compareDriver", function (old) {
					return old.mergeDeep(Immutable.fromJS(payload)).setIn(["meta", "isLoading"], false);
				});
			} else return state;
		});

		this.on(actionTypes.GET_SUGGESTION, function (state, payload) {
			if (payload) {
				return state.update(payload.target, function (oldList) {
					return oldList
						.update("list", (oldList)=>Immutable.fromJS(payload.data).shift())
						.update("meta", (oldMeta)=> {
							let _meta = Object.assign({}, payload.data[0], {isLoading: false});
							return oldMeta.mergeDeep(Immutable.fromJS(_meta));
						});
				});
			} else return state;
		});

		this.on(actionTypes.GET_NEWS_LIST, function (state, payload) {
			if (payload) {
				return state.update("news", function (oldList) {
					return oldList
						.update("list", (oldList)=>oldList.concat(Immutable.fromJS(payload).shift()))
						.update("meta", (oldMeta)=> {
							let _meta = Object.assign({}, payload[0], {isLoading: false});
							if ((payload.length - 1 < payload[0].pagesize) || (payload.length <= 1) || (_meta.total <= (state.getIn(["news", "list"]).size + payload.length - 1))) _meta.hasMore = false;
							return oldMeta.mergeDeep(Immutable.fromJS(_meta));
						});
				});
			} else return state;
		});

		this.on(actionTypes.GET_DRIVERS_LIST, function (state, payload) {
			if (payload) {
				return state.update("drivers", function (oldList) {
					return oldList
						.update("list", (oldList)=>oldList.concat(Immutable.fromJS(payload).shift()))
						.update("meta", (oldMeta)=> {
							let _meta = Object.assign({}, payload[0], {isLoading: false});
							if ((payload.length - 1 < payload[0].pagesize) || (payload.length <= 1) || (_meta.total <= (state.getIn(["drivers", "list"]).size + payload.length - 1))) _meta.hasMore = false;
							return oldMeta.mergeDeep(Immutable.fromJS(_meta));
						});
				});
			} else return state;
		});

		this.on(actionTypes.GET_CALENDAR_LIST, function (state, payload) {
			if (payload) {
				return state.update("calendar", function (oldList) {
					return oldList
						.update("list", (oldList)=>oldList.concat(Immutable.fromJS(payload).shift()))
						.update("meta", (oldMeta)=> {
							let _meta = Object.assign({}, payload[0], {isLoading: false});
							if (payload[0].type == "home") _meta.hasMore = false;
							if ((payload.length - 1 < payload[0].pagesize) || (payload.length <= 1) || (_meta.total <= (state.getIn(["calendar", "list"]).size + payload.length - 1))) _meta.hasMore = false;
							return oldMeta.mergeDeep(Immutable.fromJS(_meta));
						});
				});
			} else return state;
		});

		this.on(actionTypes.CLEAR_LIST, function (state, payload) {
			if (payload) {
				return state.update(payload.target, function (oldNewsList) {
					return oldNewsList
						.update("list", (oldList)=>Immutable.List([]))
						.update("meta", (oldMeta)=>oldMeta.mergeDeep(Immutable.fromJS({
							pager: 0,
							type: undefined,
							pagesize: undefined,
							hasMore: true
						})));
				});
			} else return state;
		});

		this.on(actionTypes.LOADING_STATUS, function (state, payload) {
			if (payload) {
				return state.update(payload.target, function (oldNewsList) {
					return oldNewsList.update("meta", (oldMeta)=>oldMeta.mergeDeep(Immutable.fromJS({
						isLoading: payload.status,
						everLoaded: true
					})));
				});
			} else return state;
		});

		this.on(actionTypes.ALERT_STATUS, function (state, payload) {
			if (payload) {
				return state.update(payload.target, function (oldNewsList) {
					return oldNewsList.update("meta", (oldMeta)=>{
						return oldMeta ? oldMeta.mergeDeep(Immutable.fromJS({
							alert: payload.status
						})) : Immutable.fromJS({alert:payload.status});
					});
				});
			} else return state;
		});

		this.on(actionTypes.SAVE_FITLER, function (state, payload) {
			if (payload) {
				return state.update(payload.target, function (oldNewsList) {
					return oldNewsList
						.update("meta", (oldMeta)=>oldMeta.mergeDeep(Immutable.fromJS({
							[payload.filterName + "Filter"]: payload.value
						})));
				});
			} else return state;
		});

		this.on(actionTypes.SET_DIALOG, function (state, payload) {
			if (payload) {
				return state.update("dialog", function (oldDialog) {
					return Immutable.fromJS(payload.dialog);
				});
			} else return state;
		});

	}
});

module.exports = Store;
