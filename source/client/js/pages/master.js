var {Router,RouteHandler,Link}= ReactRouter;
//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Media = require("client/js/media");
var Store = require("client/js/store");
//===============================================
var Dialog = require("client/js/components/dialog");
var Backtop = require("client/js/components/backtop");
var Header = require("client/js/views/header");
var Footer = require("client/js/views/footer");

var App = React.createClass({
	displayName: "App",
	propTypes: {
		children: React.PropTypes.node,
		device: React.PropTypes.string,
		location : React.PropTypes.object,
	},
	mixins: [Reactor.ReactMixin, Router.State],
	getDataBindings() {
		return {
			device: Media.getters.device,
			imagesLoaded: Media.getters.imagesLoaded,
			headReady: Media.getters.headReady,
			dialog: Store.getters.dialog
		}
	},
	buildComponent(props, state) {
		//console.log(props);
		return (state.imagesLoaded) ? (
			<div className="content">
				<Dialog dialog={state.dialog}/>
				<Header device={state.device} route={props.route} location={this.props.location}></Header>
				{props.children && React.cloneElement(props.children, {
					device: state.device
				})}
				<Footer device={state.device}></Footer>
				{state.device == "desktop" ? <Backtop icon={require("client/img/backtotop.png")}/> : null}
			</div>
		) : (
			<div className="content">
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

module.exports = App;
