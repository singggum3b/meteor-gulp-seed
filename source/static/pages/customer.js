//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
//===============================================

var IndexPage = React.createClass({
	displayName: "CustomerPage",
	propTypes: {
		device: React.PropTypes.string,
		children: React.PropTypes.node,
		route: React.PropTypes.object,
		history: React.PropTypes.object
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		//The order matter - the list need to be uptop , before the meta state
		return {}
	},
	buildIndexPage(props, state) {
		var className= cx({
			"p-customer": true
		});

		return (
				<div className={className} >
					<div>
						{`Hello i'm customer page`}
					</div>
					{this.props.children && React.cloneElement(this.props.children, {
						device: this.state.device
					})}
				</div>
		)
	},
	render() {
		return this.buildIndexPage(this.props, this.state)
	}
});

module.exports = IndexPage;
