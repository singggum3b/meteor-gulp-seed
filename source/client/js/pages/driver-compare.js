//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");

//===============================================
var Drivers = require("client/js/views/drivers");

var Page = React.createClass({
	displayName: "DriversDetailPage",
	propTypes: {
		device: React.PropTypes.string,
		children: React.PropTypes.node,
		route: React.PropTypes.object,
		history: React.PropTypes.object,
		location: React.PropTypes.object.isRequired
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		//The order matter - the list need to be uptop , before the meta state
		return {
			compareDriver: Store.getters.compareDriver
		}
	},
	componentDidMount() {
		let {current,target} = this.props.location.query;
		Store.actions.getDriverCompare({current: current, target: target});
		//console.log(this.props.location.query);
	},
	buildPage(props, state) {

		var className = cx({
			"p-drivers-compare": true
		});

		return (
			<div className={className}>
				<div className="v-block-title">
					<h2 className="title">
						Driver Comparison
					</h2>
				</div>
				<Drivers.CompareBiography device={props.device} {...state.compareDriver.toObject()} />
				<div className="v-block-title highlights">
					<h2 className="title">
						F4 Highlights
					</h2>
				</div>
				<Drivers.CompareHighLight device={props.device} {...state.compareDriver.toObject()} />
				<div className="v-block-title career">
					<h2 className="title">
						F4 Career
					</h2>
				</div>
				<Drivers.CompareStatistic device={props.device} {...state.compareDriver.toObject()} />
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
