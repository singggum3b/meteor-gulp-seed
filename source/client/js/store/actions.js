var Reactor = require("client/js/reactor.js");
var actionTypes = require("./constant").action;
var getters = require("./getters");
//=============================================
var R = Request();
R.set("Accept", "application/json");

var XHR = {
	news: null,
	drivers: null,
	calendar: null,
	driverDetail: null,
	article: null,
	suggestion: null
};

//=======================================


/*exports.filter = function ({query = undefined, tag = undefined, id = initData.APIID,page = 1,limitBy = undefined,limitRate= undefined,contentType= undefined}) {
 exports.resetDetails();
 exports.resetDialog();
 exports.resetForm();
 exports.loading();
 var filterBoxQuery = Reactor.evaluate(getters.filtersMeta).get("query");
 XHR.filter && XHR.filter.abort();
 XHR.filter = R.get(baseURL + "/contentdata/contents/" + initData.APIID + "?page=" + page)
 .query({
 q: (query && query != "") ? query : filterBoxQuery,
 tag: tag,
 id: id,
 limitBy: limitBy,
 limitRate: limitRate,
 contentType: contentType
 })
 .end(function (err, res) {
 //console.log(res.body);
 Reactor.dispatch(actionTypes.FILTER, res.body.Data);
 });
 };*/

exports.postForm = function ({target=undefined,URL=undefined,data=undefined,onSuccess=undefined,onFailed=undefined}) {
	if (target) {
		exports.loadingStatus(target, true);
		XHR.postForm && XHR.postForm.abort();
		(URL && data) && (XHR.postForm = R.post(URL)
			.send(data)
			.end(function (err, res) {
				if (err) {
					console.warn(err);
					onFailed && onFailed();
				} else {
					onSuccess && onSuccess();
				}
				Reactor.dispatch(actionTypes.POST_FORM, {target: target, body: res.body ? res.body[0]: null, statusCode: res.statusCode});
			}));
	}
};

exports.enableLoginPanel= function (isEnabled) {
	Reactor.dispatch(actionTypes.MODIFY_META,{target: "login",entry: "enableLoginPanel",value: isEnabled});
};

exports.login = function ({email=undefined,password=undefined}) {
	exports.loadingStatus("login", true);
	XHR.login && XHR.login.abort();
	if (email && password) {
		(XHR.login = R.post(`/api/profile/user/login`)
			.send({
				username: email,
				password: password
			})
			.end(function (err, res) {
				if (err) {
					console.warn(err);
				}
				exports.loadingStatus("login", false);
				Reactor.dispatch(actionTypes.LOGIN, {body: res.body[0], statusCode: res.statusCode});
			}));
	}
};

exports.logout = function () {
	exports.loadingStatus("login", true);
	XHR.login && XHR.login.abort();
	XHR.login = R.post(`/api/profile/user/logout`)
		.end(function (err, res) {
			if (err) {
				console.warn(err);
			}
			Reactor.dispatch(actionTypes.LOGOUT, {statusCode: res.statusCode});
		});
};

exports.forgotPassword = function ({email=undefined}) {
	exports.loadingStatus("login", true);
	XHR.login && XHR.login.abort();
	XHR.login = R.post(`/api/profile/user/request_new_password`)
		.send({name: email})
		.end(function (err, res) {
			if (err) {
				console.warn(err);
			}
			exports.loadingStatus("login", false);
			Reactor.dispatch(actionTypes.FORGOT_PASSWORD, {body: res.body[0], statusCode: res.statusCode});
		});
};

exports.alertStatus = function (target, status) {
	Reactor.dispatch(actionTypes.ALERT_STATUS, {target: target, status: status});
};


exports.getStaticPage = function ({id=undefined}) {
	exports.loadingStatus("article", true);
	XHR.article && XHR.article.abort();
	id && (XHR.article = R.get(`/api/page/${id}`)
		.query({})
		.end(function (err, res) {
			if (err) {
				console.warn(err);
			} else {
				Reactor.dispatch(actionTypes.GET_ARTICLE, res.body[0]);
			}
		}));
};

exports.getArticle = function ({id=undefined}) {
	exports.loadingStatus("article", true);
	XHR.article && XHR.article.abort();
	id && (XHR.article = R.get(`/api/news/feed/${id}`)
		.query({})
		.end(function (err, res) {
			if (err) {
				console.warn(err);
			} else {
				if (res.body[0]) {
					Reactor.dispatch(actionTypes.GET_ARTICLE, res.body[0]);
				} else {
					window.location.href = "/404";
				}
			}
		}));
};

exports.getDriversList = function ({pager=0,type="",id=undefined,name=undefined,champion=undefined,country=undefined,letter=undefined,pagesize=undefined}={}) {
	exports.loadingStatus("drivers", true);
	XHR.drivers && XHR.drivers.abort();
	XHR.drivers = R.get(`/api/drivers/driver`)
		.query({
			pager: pager,
			uid: id,
			name: name ? name.trim() : name,
			champion: champion,
			country: country,
			pagesize: pagesize,
			letter: letter,
			type: type
		})
		.end(function (err, res) {
			if (err) {
				console.warn(err);
			} else {
				Reactor.dispatch(actionTypes.GET_DRIVERS_LIST, res.body);
			}
		});
};

exports.getNewsList = function ({pager=0,type="",pagesize=undefined,role="",uid=undefined}={}) {
	exports.loadingStatus("news", true);
	XHR.news && XHR.news.abort();
	XHR.news = R.get(`/api/news/feed`)
		.query({
			pager: pager,
			type: type,
			pagesize: pagesize,
			role: role,
			uid: uid
		})
		.end(function (err, res) {
			if (err) {
				console.warn(err);
			} else {
				Reactor.dispatch(actionTypes.GET_NEWS_LIST, res.body);
			}
		});
};

exports.getCalendarList = function ({pager=0,type="",pagesize=undefined}={}) {
	exports.loadingStatus("calendar", true);
	XHR.calendar && XHR.calendar.abort();
	XHR.calendar = R.get(`/api/event/calendar`)
		.query(...arguments)
		.end(function (err, res) {
			if (err) {
				console.warn(err);
			} else {
				Reactor.dispatch(actionTypes.GET_CALENDAR_LIST, res.body);
			}
		});
};

exports.getDriverDetail = function ({id=undefined}) {
	exports.loadingStatus("currentDriver", true);
	XHR.driverDetail && XHR.driverDetail.abort();
	XHR.driverDetail = R.get(`/api/drivers/driver/${id}`)
		.query({})
		.end(function (err, res) {
			if (err) {
				console.warn(err);
			} else {
				if (res.body.length == 0) window.location.href = "/404";
				Reactor.dispatch(actionTypes.GET_DRIVER_DETAIL, res.body[0]);
			}
		});
};

exports.getDriverCompare = function ({current=undefined,target=undefined}) {
	exports.loadingStatus("compareDriver", true);
	XHR.driverCompare && XHR.driverCompare.abort();
	XHR.driverCompare = R.get(`/api/driver/compare`)
		.query({
			current: current,
			target: target
		})
		.end(function (err, res) {
			if (err) {
				console.warn(err);
			} else {
				//if (res.body.length == 0) window.location.href = "/404";
				Reactor.dispatch(actionTypes.GET_DRIVER_COMPARE, res.body[0]);
			}
		});
};

exports.loadMore = function (target, meta, device) {
	exports.loadingStatus(target, true);
	mdx(target, {
		"news": ()=> {
			let {pager,type,pagesize} = meta;
			exports.getNewsList(Object.assign({}, meta, {
				pager: parseInt(pager) + 1,
				//filter: undefined,
				isLoading: undefined
			}));
		},
		"drivers": ()=> {
			let {pager,type,pagesize} = meta;
			exports.getDriversList(Object.assign({}, meta, {
				pager: parseInt(pager) + 1,
				//filter: undefined,
				name: meta.nameFilter,
				isLoading: undefined,
				pagesize: device == DEVICE[0] ? 12 : 12
			}));
		},
		"calendar": ()=> {
			let {pager,type,pagesize} = meta;
			exports.getCalendarList(Object.assign({}, meta, {
				pager: parseInt(pager) + 1,
				//filter: undefined,
				isLoading: undefined
			}));
		}
	});
};

exports.loadingStatus = function (target, status) {
	Reactor.dispatch(actionTypes.LOADING_STATUS, {target: target, status: status});
};

exports.saveFilter = function (target, filterName, value) {
	Reactor.dispatch(actionTypes.SAVE_FITLER, {target: target, filterName: filterName, value: value});
};

exports.selectSuggestionDriver = function ({id=undefined,name=undefined}) {
	if (id && name) {
		Reactor.dispatch(actionTypes.CLEAR_LIST, {target: "drivers"});
		exports.saveFilter("drivers", "name", name);
		exports.saveFilter("currentDriver", "compareID", id);
	}
};

exports.resetSuggestion = function (target) {
	exports.saveFilter(target, "name", "");
	Reactor.dispatch(actionTypes.CLEAR_LIST, {target: target});
};

exports.suggestion = function (target, type, value, meta, delay, requireFilter, extra) {
	exports.saveFilter(target, type, value);
	XHR.suggestion && XHR.suggestion.abort();

	extra = Object.assign({
		ignoreNull: false,
		activeLength: Infinity
	}, extra);

	if ((extra && extra.ignoreNull && (!value || value == "" ))) {
		this._pending && clearTimeout(this._pending);
		exports.loadingStatus(target, false);
		return;
	}

	if (extra && (value.length < extra.activeLength)) return;

	(!delay) && exports.loadingStatus(target, true);
	mdx(target, {
		"suggestionDrivers": ()=> {

			exports.saveFilter(target, type, value);

			Reactor.batch(()=> {
				this._pending && clearTimeout(this._pending);
				this._pending = setTimeout(()=> {

					Reactor.dispatch(actionTypes.CLEAR_LIST, {target: target});
					(!delay) && (XHR.drivers = R.get(`/api/drivers/driver`)
						.query({
							[type]: value,
							type: "suggestion"
						})
						.end(function (err, res) {
							if (err) {
								console.warn(err);
							} else {
								Reactor.dispatch(actionTypes.GET_SUGGESTION, {target: target, data: res.body});
							}
						}));

				}, (extra && extra.delay) ? extra.delay : 0);
			});
		}
	});
};

exports.filter = function (target, type, value, meta, delay, requireFilter, extra) {
	XHR.drivers && XHR.drivers.abort();
	if ((extra && extra.ignoreNull && (!value || value == "" ))) {
		this._pending && clearTimeout(this._pending);
		exports.loadingStatus(target, false);
		return;
	}
	if (target == "drivers" && type == "name" && (value.length < 3) && value !== "") return;

	let _meetRequire = requireFilter ? !requireFilter.some((requireFilter, index)=> {
		return (!meta[requireFilter] || meta[requireFilter] == "");
	}) : true;

	(_meetRequire && !delay) && exports.loadingStatus(target, true);
	mdx(target, {
		"news": ()=> {
			let {pagesize} = meta;
			Reactor.batch(function () {
				exports.saveFilter(target, type, value);
				Reactor.dispatch(actionTypes.CLEAR_LIST, {target: target});
				//console.log(meta);

				(_meetRequire && !delay) && exports.getNewsList(Object.assign({}, meta, {
					pager: 0,
					[type]: value,
					filter: undefined
				}));

			});
		},
		"drivers": ()=> {
			let {pagesize} = meta;

			if (extra && extra.compareID) {
				type != "name" && exports.saveFilter("drivers", "name", "");
				exports.saveFilter("currentDriver", "compareID", undefined);
			} else {
				exports.saveFilter(target, type, value);
			}

			Reactor.batch(()=> {
				this._pending && clearTimeout(this._pending);
				this._pending = setTimeout(()=> {

					Reactor.dispatch(actionTypes.CLEAR_LIST, {target: target});
					(_meetRequire && !delay) && exports.getDriversList(Object.assign({}, meta, {
						pager: 0,
						pagesize: 24,
						name: meta.nameFilter,
						country: meta.countryFilter,
						champion: meta.championFilter,
						letter: meta.letterFilter,
						filter: undefined,
						isLoading: undefined,
						hasMore: undefined
					}, {
						[type]: value
					}));

				}, (extra && extra.delay) ? extra.delay : 0);
			});
		}
	});
};


exports.setDialog = function (dialog) {
	Reactor.dispatch(actionTypes.SET_DIALOG, {dialog: dialog});
};
