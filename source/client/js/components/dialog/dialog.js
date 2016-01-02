//====================REACT======================
var Popup = require('js/components/popup');
var Layer = require('js/components/layer');
var Button = require("js/components/button");

var Dialog = React.createClass({
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		dialog: React.PropTypes.object
	},
	buildLayer(props,state) {
		return props.dialog ? <Layer></Layer> : null;
	},
	buildPopup(props,state) {
		if (props.dialog) {
			var {content,accept,decline} = props.dialog.toJS();
			return (
					<Popup onClose={decline}>
						<div className="content">
							<div className="message">{content.message}</div>
							<div className="action">
								<Button onClick={accept} title={content.accept}></Button>
								<Button onClick={decline} title={content.decline}></Button>
							</div>
						</div>
					</Popup>
			);
		} else return null;
	},
	render() {

		return (
				<div className="b-dialog">
					{this.buildLayer(this.props,this.state)}
					<ReactCSSTransitionGroup component="div" transitionName="popup-animation" transitionAppear={true} transitionAppearTimeout={500}
																	 transitionEnterTimeout={800} transitionLeaveTimeout={800} >
						{this.buildPopup(this.props,this.state)}
					</ReactCSSTransitionGroup>
				</div>
		);
	}
});

module.exports = Dialog;
