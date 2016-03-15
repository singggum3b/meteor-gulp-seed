var Reactor = require("client/js/reactor.js");

Reactor.registerStores({
	media: require("./store")
});

module.exports = {
	actions: require("./actions"),
	getters: require("./getters")
};
