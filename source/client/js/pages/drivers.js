//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//===============================================
var Drivers = require("client/js/views/drivers");

var Page = React.createClass({
	displayName: "DriversPage",
	propTypes: {
		device: React.PropTypes.string,
		children: React.PropTypes.node,
		route: React.PropTypes.object,
		history: React.PropTypes.object
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		//The order matter - the list need to be uptop , before the meta state
		return {
			drivers: Store.getters.drivers
		}
	},
	componentDidMount() {
		//console.log(this.props.device);
		this.props.device == DEVICE[0] ? Store.actions.getDriversList({pagesize: 24}) : Store.actions.getDriversList({pagesize: 24});
	},
	buildPage(props, state) {

		var className = cx({
			"p-drivers": true
		});

		return (
			<div className={className}>
				<div className="v-block-title">
					<h2 className="title">
						The formula 4 drivers club
					</h2>
					<p className="description">
						{initData.text.driversListSubtitle1}
					</p>
				</div>
				<Drivers.List device={props.device} showViewAll={false} {...state.drivers.toObject()} />
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
