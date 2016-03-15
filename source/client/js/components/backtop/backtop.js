var Backtop = React.createClass({
	displayName: "Backtop",
	propTypes: {
		children: React.PropTypes.node,
		className: React.PropTypes.string,
		icon: React.PropTypes.string.isRequired
	},
	getInitialState() {
		return {
			isShow: $(window).scrollTop() ? true : false
		}
	},
	onScroll(e) {
		let scrollTop = $(window).scrollTop();
		if (scrollTop && !this.state.isShow) {
			this.setState({
				isShow: true
			})
		} else if (!scrollTop && this.state.isShow) {
			this.setState({
				isShow: false
			})
		}
	},
	backToTop() {
		$("html, body").animate({scrollTop: 0}, "easeInOut");
	},
	componentDidMount() {
		$(window).on("scroll", this.onScroll);
	},
	componentWillUnmount() {
		$(window).off("scroll", this.onScroll);
	},
	buildComponent(props, state) {
		let _className = cx({
			"b-backtop": true,
			[this.props.className]: !!props.className
		});
		return state.isShow ? (
			<div className={_className} onClick={this.backToTop}>
				<img src={props.icon} alt="Back top"/>
			</div>
		) : null
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

module.exports = Backtop;
