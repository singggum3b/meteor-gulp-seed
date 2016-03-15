var ProgressBar = React.createClass({
	displayName: "ProgressBar",
	propsType: {
		percent: React.PropTypes.number.isRequired,
		transitionDuration: React.PropTypes.number //Milisecond
	},
	buildProgressBar(state, props) {
		var className = cx({
			"b-progress-bar": true
		});
		return (
			<div className={className}>
				{this.buildProgress(state, props)}
			</div>
		)
	},
	buildProgress(state, props) {
		var transitionDuration = props.transitionDuration ? props.transitionDuration / 1000 + "s" : 0 + "s";
		var style = {
			width: props.percent + "%",
			"transitionDuration": transitionDuration,
			"WebkitTransitionDuration": transitionDuration
		};
		return (
			<div className="bar" style={style}></div>
		)
	},
	render() {
		return this.buildProgressBar(this.state, this.props)
	}
});
module.exports = ProgressBar;
