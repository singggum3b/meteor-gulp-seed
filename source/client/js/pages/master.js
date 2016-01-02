var {Router,RouteHandler,Link}= ReactRouter;
//==================FLUX=========================
var Reactor = require("js/reactor.js");
var Media = require("js/media");
var BagStore = require("js/bag-store");
//===============================================
var Dialog = require("js/components/dialog");

var App = React.createClass({
	displayName: "App",
	propTypes: {
		children: React.PropTypes.node,
		device: React.PropTypes.string
	},
	mixins: [Reactor.ReactMixin, Router.State],
	getDataBindings() {
		return {
			device: Media.getters.device,
			imagesLoaded: Media.getters.imagesLoaded,
			dialog: BagStore.getters.dialog
		}
	},
	render() {
		return this.state.imagesLoaded ? (
				<div className="content">
					<Dialog dialog={this.state.dialog} />
					{this.props.children && React.cloneElement(this.props.children, {
						device: this.state.device
					})}
				</div>
		): (
				<div className="content">
					<div className="loader">
						<img src={require("img/not-preloaded/loader.gif")} alt="Preloader"/>
						<p>
							{"LOADING..."}
						</p>
					</div>
				</div>
		)
	}
});

module.exports = App;
