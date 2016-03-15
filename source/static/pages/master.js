var {Router,RouteHandler,Link}= ReactRouter;
//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Media = require("client/js/media");
//===============================================

var App = React.createClass({
	displayName: "App",
	propTypes: {
		children: React.PropTypes.node,
		device: React.PropTypes.string
	},
	mixins: [Reactor.ReactMixin, Router.State],
	getDataBindings() {
		return {
			device: Media.getters.device
		}
	},
	render() {
		return (
				<div className="content">
					<img src={require("../img/SVG_logo.svg")} alt=""/>
					{this.props.children && React.cloneElement(this.props.children, {
						device: this.state.device
					})}
				</div>
		)
	}
});

module.exports = App;
