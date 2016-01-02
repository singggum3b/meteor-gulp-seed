//==================FLUX=========================
var Reactor = require("js/reactor.js");
//===============================================
var Bag = require("js/views/bag");
var IntroLogo = require("js/views/intro-logo");
var IntroText = require("js/views/intro-text");

var IndexPage = React.createClass({
	displayName: "IndexPage",
	propTypes: {
		device: React.PropTypes.string,
		children: React.PropTypes.node
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		//The order matter - the list need to be uptop , before the meta state
		return {}
	},
	buildIndexPage(props, state) {
		var mode = this.props.route.path == "/bag/:size" ? "config" : "preview";
		var className= cx({
			"v-index-page": true,
			["-"+mode]: true
		});

		return (
				<div className={className} >
					<IntroLogo></IntroLogo>
					<IntroText visible={mode == "preview"}></IntroText>
					<div className="v-bag-wrapper">
						<Bag device={props.device} mode={mode} size={props.params.size}></Bag>
					</div>
					<div className="v-bag-chooser-wrapper">
						<Bag.SizeChooser device={props.device} visible={mode == "preview"} params={props.params} ></Bag.SizeChooser>
					</div>
					{this.props.children && React.cloneElement(this.props.children, {
						device: this.state.device
					})}
					{mode == "config" && <Bag.SubmitButton history={this.props.history} size={props.params.size}></Bag.SubmitButton>}
				</div>
		)
	},
	render() {
		return this.buildIndexPage(this.props, this.state)
	}
});

module.exports = IndexPage;
