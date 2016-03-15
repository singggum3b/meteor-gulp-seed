var Reactor = require("js/reactor.js");

Reactor.registerStores({
	bag: require("./store")
});

module.exports = {
	actions: require("./actions"),
	getters: require("./getters")
};
