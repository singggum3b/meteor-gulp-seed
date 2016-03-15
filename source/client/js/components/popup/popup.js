var popupCount = 0;
var Button = require("client/js/components/button");

var Popup = React.createClass({
	displayName: "Popup",
	propTypes: {
		device: React.PropTypes.string,
		onClose: React.PropTypes.func,
		closeIcon: React.PropTypes.string,
		closeIconHover: React.PropTypes.string,
		className: React.PropTypes.string,
		children: React.PropTypes.node
	},
	getDefaultProps() {
		return {
			device: DEVICE[2],
			closeIcon: "/img/svg/close.svg",
			closeIconHover: "/img/svg/close_active.svg"
		}
	},
	componentDidMount() {
		popupCount++;
		this.fixBody();
	},
	componentDidUpdate() {

	},
	componentWillUnmount() {
		popupCount--;
		this.unFixBody();
	},
	onClose() {
		this.unFixBody();
		this.props.onClose && this.props.onClose();
	},
	fixBody() {
		$("html").css({
			height: "100%",
			overflow: "hidden"
		});
		if (this.props.device != DEVICE[2] || $.TOUCH_DEVICE) {
			this._lastScrollTop = $("body").scrollTop();
			$.debounce(250, ()=> {
				$("html").addClass("no-scroll")
			})();
		}
	},
	unFixBody() {
		$("html").css({
			height: "",
			overflow: ""
		}).removeClass("no-scroll");
		$("body").scrollTop(this._lastScrollTop);
	},
	render() {
		var _className = cx({
			[this.props.className]: !!this.props.className,
			"b-popup": true
		});

		return (
			<div className={_className}>
				<Button title="Close" className="close" mode="image" icon={this.props.closeIcon}
								iconHover={this.props.closeIconHover} onClick={this.onClose}></Button>
				{this.props.children}
			</div>
		)
	}
});

module.exports = Popup;
