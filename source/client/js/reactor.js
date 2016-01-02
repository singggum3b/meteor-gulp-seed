var Reactor = new Nuclear.Reactor({
	debug: process.env.NODE_ENV != "production"
});


//TODO: check nuclearjs update
//Temporary fix util Nuclear-JS address this issue https://github.com/optimizely/nuclear-js/issues/141
const oldDispatch = Reactor.dispatch.bind(Reactor);
Reactor.dispatch = (actionType, payload) => {
	ReactDOM.unstable_batchedUpdates(() => oldDispatch(actionType, payload));
};

module.exports = Reactor;
