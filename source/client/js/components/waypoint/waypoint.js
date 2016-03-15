var Waypoints = React.createClass({
	displayName: "Waypoints",
	propTypes: {
		onEnterDown: React.PropTypes.func,
		onEnterUp: React.PropTypes.func,
		offset: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.func, React.PropTypes.string])
	},
	componentDidMount() {
		var el = this.refs.waypoint.getDOMNode();
		if (el) {
			this._waypoint = new Waypoint({
				element: el,
				offset: this.props.offset,
				handler: (direction) => {
					//console.log(direction);
					if (direction == "down") {
						this.props.onEnterDown && this.props.onEnterDown();
					} else if (direction == "up") {
						this.props.onEnterUp && this.props.onEnterUp();
					}
				}
			});
		}
	},
	componentWillUnmount() {
		this._waypoint && this._waypoint.destroy();
	},
	render() {
		return <span className="waypoint-anchor" ref="waypoint"></span>;
	}
});

module.exports = Waypoints;
