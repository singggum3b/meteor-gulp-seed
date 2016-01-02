//==================FLUX=========================
var Reactor = require("js/reactor.js");
var BagStore = require("js/bag-store");

var IntroText = React.createClass({
	displayName: "IntroText",
	propTypes: {
		visible: React.PropTypes.bool
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		return {
			selectedBagOptions: BagStore.getters.selectedBagOptions
		}
	},
	buildDesc(props,state) {
		var className= cx({
			"desc animated" : true,
			"fadeIn": props.visible,
			"fadeOut": !props.visible
		});

		return (
				<div className={className} dangerouslySetInnerHTML={{__html: state.selectedBagOptions.getIn(["size","description"])}}>
				</div>
		)
	},
	buildIntroText(props, state) {
		return (
				<ReactCSSTransitionGroup component="div" className="v-intro-text" transitionName="trigger-ani"
																 transitionAppear={true} transitionAppearTimeout={1000}
																 transitionEnterTimeout={500} transitionLeaveTimeout={500}>
					<div className="content">
						<h2 className="title" dangerouslySetInnerHTML={{__html: state.selectedBagOptions.getIn(["size","htmlTitle"]) || "<span>COACH</span><span>Swagger</span>"}}>
						</h2>
						<div className="alt-title">
							in metallic pebble leather
						</div>
						<hr/>
						{this.buildDesc(props,state)}
					</div>
				</ReactCSSTransitionGroup>
		)
	},
	render() {
		return this.buildIntroText(this.props, this.state);
	}
});

module.exports = IntroText;
