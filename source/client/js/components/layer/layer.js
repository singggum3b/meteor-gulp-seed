var Layer = React.createClass({
	displayName: "Layer",
	propTypes: {
		onClick: React.PropTypes.func,
		onScroll: React.PropTypes.func,
		parent: React.PropTypes.bool,
		onWheel: React.PropTypes.func,
		className: React.PropTypes.string,
		style: React.PropTypes.string,
		children: React.PropTypes.node
	},
	onClick: function (e) {
		if (e.target === e.currentTarget) {
			this.props.onClick && this.props.onClick(e);
		}
	},
	onWheel(e) {
		this.props.onWheel && this.props.onWheel(e);
	},
	render() {
		var {parent} = this.props;
		var _className = cx({
			"b-overlay": true,
			"b-overlay--parent": !!parent,
			[this.props.className]: !!this.props.className
		});

		return (
				<div title="Click to close" className={_className} onWheel={this.onWheel} onClick={this.onClick} style={this.props.style}
						 onTouchMove={(e)=>{e.preventDefault();e.stopPropagation();}}>
					{this.props.children}
				</div>
		);
	}
});

module.exports = Layer;
