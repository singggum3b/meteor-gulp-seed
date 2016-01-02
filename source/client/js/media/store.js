var actionTypes = require("./constant").action;
var Reactor = require("js/reactor.js");

//Media match store
var media = new Nuclear.Store({
	getInitialState: function () {
		return Immutable.fromJS({
			width: $(window).width(),
			device: null,
			test: null,
			imagesLoaded: false
		});
	},

	initialize: function () {

		this.on(actionTypes.WINDOW_RESIZE, function (state, payload) {
			return state.update("width", function () {
				return payload.width;
			})
		});

		this.on(actionTypes.UPDATE_DEVICE, function (state, payload) {
			return state.update("device", function () {
				return payload.device;
			})
		});

		this.on(actionTypes.IMAGES_LOADED, function (state, payload) {
			return state.update("imagesLoaded", function () {
				return true;
			})
		});

		$(window).resize($.debounce(300, function () {
			var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			Reactor.dispatch(actionTypes.WINDOW_RESIZE, {
				width: w
			})
		}));

	}
});

module.exports = media;
