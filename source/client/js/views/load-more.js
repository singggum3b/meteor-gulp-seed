//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//===========================================
var Button = require("client/js/components/button");
var Loading = require("client/js/components/loading");

var LoadMore = React.createClass({
	displayName: "LoadMore",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		target: React.PropTypes.oneOf(["news", "drivers", "calendar"]).isRequired,
		title: React.PropTypes.string,
		buildViewAll: React.PropTypes.func
	},
	getDefaultProps() {
		return {
			title: "Load More"
		}
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		return {
			[this.props.target]: Store.getters[this.props.target]
		}
	},
	loadMore(props, state) {
		Store.actions.loadMore(props.target, state[props.target].get("meta").toJS(), props.device);
	},
	buildComponent(props, state) {
		let _hasMore = state[this.props.target].getIn(["meta", "hasMore"]);
		let _everLoaded = state[this.props.target].getIn(["meta", "everLoaded"]);
		let _loading = state[this.props.target].getIn(["meta", "isLoading"]);
		if (_loading) {
			return <Loading />
		} else {
			return (_hasMore && _everLoaded) ? (
				<Button className="btn load-more" onClick={()=>this.loadMore(props,state)} title={props.title}></Button>
			) : (props.buildViewAll ? props.buildViewAll() : null)
		}
	},
	render() {
		return this.buildComponent(this.props, this.state)
	}
});

module.exports = LoadMore;
