var Reactor = require("client/js/reactor.js");
var actionTypes = require("./constant").action;
//=============================================

exports.updateDevice = function (device) {
	Reactor.dispatch(actionTypes.UPDATE_DEVICE, {device: device});
};

exports.imagesLoaded = function () {
	Reactor.dispatch(actionTypes.IMAGES_LOADED, null);
};

exports.headReady = function () {
	Reactor.dispatch(actionTypes.HEAD_READY, null);
};
