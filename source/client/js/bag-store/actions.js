var Reactor = require("js/reactor.js");
var actionTypes = require("./constant").action;
var getters = require("./getters");
//=============================================
var R = Request();
R.set("Accept", "application/json");

var XHR = {
	filter: null
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

exports.setBagOptions = function (options) {
	Reactor.dispatch(actionTypes.SET_BAG_OPTION, options);
};

exports.togglePalette= function (type,isShow) {
	Reactor.dispatch(actionTypes.TOGGLE_PALETTE, {type: type,isShow: !!isShow});
};

exports.toggleSizeChooser = function (mode) {
	Reactor.dispatch(actionTypes.TOGGLE_SIZECHOOSER, {mode: mode});
};

exports.updateBagDataBasedOnSize = function (size) {
	Reactor.dispatch(actionTypes.UPDATE_BAGDATA, {size: size});
};

exports.selectSize = function (size) {
	size && $.debounce(10, function () {
		Reactor.batch(function () {
			exports.setBagOptions({size: size});
			exports.updateBagDataBasedOnSize(size);
		});
	})();
};

exports.resetBagOption = function () {
	Reactor.batch(function () {
		Reactor.dispatch(actionTypes.RESET_BAGOPTION, null );
		exports.updateCustomerName("");
		exports.updateCustomerComment("");
	});

};

exports.updateCustomerComment = function (comment) {
	Reactor.dispatch(actionTypes.UPDATE_CUSTOMER_COMMENT, {comment: comment});
};

exports.updateCustomerName = function (name) {
	Reactor.dispatch(actionTypes.UPDATE_CUSTOMER_NAME, {name: name});
};

exports.setDialog = function (dialog) {
	Reactor.dispatch(actionTypes.SET_DIALOG,{dialog: dialog});
};
