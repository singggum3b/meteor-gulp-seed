var Reactor = require("client/js/reactor.js");

Reactor.registerStores({
	store: require("./store")
});

module.exports = {
	actions: require("./actions"),
	getters: require("./getters")
};
