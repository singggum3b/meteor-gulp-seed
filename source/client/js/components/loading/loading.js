var Loading = React.createClass({
	displayName: "Loading",
	propTypes: {
		title: React.PropTypes.string,
		className: React.PropTypes.string,
		page: React.PropTypes.bool
	},
	getDefaultProps() {
		return {
			title: "Loading.."
		}
	},
	buildComponent(props, state) {
		let _className = cx({
			"b-loading": true,
			[props.className]: props.className,
			"b-loading--page": props.page
		});
		return (
			<div className={_className}>
				<div className="wrapper">
					<img src={require("client/img/not-preloaded/rolling.gif")} alt="Preloader"/>
					<p>
						{props.title}
					</p>
				</div>
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state)
	}
});

module.exports = Loading;
