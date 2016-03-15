//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");

//===============================================
var Drivers = require("client/js/views/drivers");
var Suggestion = require("client/js/views/suggestion");

var Page = React.createClass({
	displayName: "SearchPage",
	propTypes: {
		device: React.PropTypes.string,
		children: React.PropTypes.node,
		route: React.PropTypes.object,
		history: React.PropTypes.object,
		params: React.PropTypes.object
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		//The order matter - the list need to be uptop , before the meta state
		return {
			drivers: Store.getters.drivers,
			suggestionDrivers: Store.getters.suggestionDrivers
		}
	},
	componentDidMount() {
		let _query = this.props.location.query.query;
		if (_query && _query != "") {
			Store.actions.getDriversList({name: _query,type: "suggestion"});
			Store.actions.saveFilter("suggestionDrivers", "name", _query);
			Store.actions.saveFilter("drivers", "name", _query);
		}
	},
	buildPage(props, state) {

		var className = cx({
			"p-search": true
		});

		let _query = state.drivers.getIn(["meta", "nameFilter"]);
		_query = _query ? _query : "";

		return (
			<div className={className}>
				<div className="v-block-title">
					<h2 className="title">
						Result for Drivers
					</h2>
					{!state.drivers.getIn(["meta","isLoading"]) && <p className="description">
						{`We found`} <strong>{`${state.drivers.getIn(["meta","total"]) || 0} driver(s)`}</strong> {`for "${_query}"`}
					</p>}
				</div>
				<Drivers.List showFilter={false} device={props.device}
											showViewAll={false} {...state.drivers.toObject()} />
				{this.props.children && React.cloneElement(this.props.children, {
					device: this.state.device
				})}
			</div>
		)
	},
	render() {
		return this.buildPage(this.props, this.state)
	}
});

module.exports = Page;
