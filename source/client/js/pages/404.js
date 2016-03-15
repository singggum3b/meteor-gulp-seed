//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");

var Page = React.createClass({
	displayName: "DriversDetailPage",
	propTypes: {
		device: React.PropTypes.string,
		children: React.PropTypes.node,
		route: React.PropTypes.object,
		history: React.PropTypes.object,
		location: React.PropTypes.object.isRequired
	},
	buildPage(props, state) {

		var className = cx({
			"p-404": true
		});

		return (
			<div className={className}>
				<div className="v-block-title">
					<h2 className="title">
						404 - Not Found
					</h2>
				</div>
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
