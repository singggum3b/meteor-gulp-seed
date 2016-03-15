//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//==================FLUX=========================
var Layer = require("client/js/components/layer");
var Button = require("client/js/components/button");
var Loading = require("client/js/components/loading");
var Filter = require("client/js/views/filter");

var MiniPanel = React.createClass({
	displayName: "MiniPanel",
	propTypes: {
		title: React.PropTypes.string,
		device: React.PropTypes.oneOf(DEVICE),
		onHide: React.PropTypes.func,
		children: React.PropTypes.node,
		visible: React.PropTypes.bool
	},
	getDefaultProps() {
		//console.log(this);
		return {}
	},
	getInitialState() {
		return {
			visible: this.props.visible
		}
	},
	onHide() {
		this.setState({
			visible: false
		})
	},
	componentWillReceiveProps(nextProps) {

		if ((this.props.visible != nextProps.visible) || (nextProps.visible != this.state.visible)) {
			this.setState({visible: nextProps.visible});
		}
	},
	buildComponent(props, state) {
		let _className = cx({
			"animation-wrapper": true,
			"active": state.visible
		});

		return (
			<div className="v-mini-panel">
				{state.visible &&
				<Layer onClick={props.onHide ? props.onHide : this.onHide} allowTouchMove={!props.preventDefault}></Layer>}
				<ReactCSSTransitionGroup component="div" className={_className} transitionName="trigger-ani"
																 transitionAppear={true} transitionAppearTimeout={1000}
																 transitionEnterTimeout={500} transitionLeaveTimeout={500}>
					{state.visible ? (
						<div className="content-wrapper">
							{props.title && <h3 className="title">{props.title}</h3>}
							<div className="content">
								{this.props.children && React.cloneElement(this.props.children, {
									device: props.device
								})}
							</div>
						</div>
					) : null}
				</ReactCSSTransitionGroup>
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

module.exports = MiniPanel;
