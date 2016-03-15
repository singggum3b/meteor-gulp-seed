//http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	};
}

function describeArc(x, y, radius, startAngle, endAngle) {

	var start = polarToCartesian(x, y, radius, endAngle);
	var end = polarToCartesian(x, y, radius, startAngle);

	var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

	return [
		"M", start.x, start.y,
		"A", radius, radius, 0, arcSweep, 0, end.x, end.y
	].join(" ");
}

//===============================================================

var RadialMenu = React.createClass({
	displayName: "RadialMenu",
	propTypes: {
		list: React.PropTypes.object,
		onClick: React.PropTypes.func,
		onClickOutside: React.PropTypes.func,
		selectedIndex: React.PropTypes.number
	},
	getDefaultProps() {
		return {
			selectedIndex: undefined
		}
	},
	onClickItem(item, index) {
		this.props.onClick(item, index);
	},
	onClickOutside() {
		this.props.onClickOutside && this.props.onClickOutside();
	},
	buildArcParams(list, item, index) {
		var centralAngle = 360 / list.size;
		centralAngle = centralAngle > 90 ? 90 : centralAngle;
		return {
			startAngle: index * centralAngle,
			endAngle: (index + 1) * centralAngle
		}
	},
	buildMenuCenter(props, state) {
		var item = props.list.get(props.selectedIndex);
		return item ? (
			<div className="b-radialmenu-center">
				{item.get("img") && <img className="center-image" src={item.get("img")} alt={item.get("title")}/>}
				<div className="content">
					{item.get("title")}
				</div>
			</div>
		) : (
			<div className="b-radialmenu-center -blank">
				<div className="content">
					{"Please select an option"}
				</div>
			</div>
		)
	},
	buildRadialMenu(props, state) {
		return (
			<div className="b-radialmenu -svg">
				<div className="b-radialmenu-wrapper">
					{this.buildMenuCenter(this.props, this.state)}
					<svg xmlSpace="http://www.w3.org/2000/svg" width="100%" height="100%" className="b-radialmenu-core">
						<defs>
							<clipPath id="circleMask">
								<circle cx="50" cy="50" r="50"/>
							</clipPath>
						</defs>
						<svg x="0" y="0" viewBox="0 0 100 100" width="100%" height="100%">
							<rect width="100" height="100" opacity="0" onClick={this.onClickOutside}/>
							<g className="item-list">
								{
									props.list.map((item, index)=> {
										let itemClass = cx({
											"item-svg": true,
											"-active": index == props.selectedIndex
										});
										let arcParams = this.buildArcParams(props.list, item, index);
										return (
											<g className={itemClass} key={index}>
												<defs>
													<pattern id={"thumb-" + index} patternUnits="objectBoundingBox" width="100%"
																	 height="100%">
														<image xlinkHref={item.get("img")} width="50" height="50"/>
													</pattern>
												</defs>
												<path className="item-shape" onClick={(e)=>{this.onClickItem(item,index)}}
															d={[describeArc(50,50,50,arcParams.startAngle,arcParams.endAngle),"L", 50, 50,"Z"].join(" ")}
															fill={`url(#${"thumb-" + index})`} stroke="white" strokeWidth="0.5">
												</path>
											</g>
										)
									})
								}
							</g>
						</svg>
					</svg>
				</div>
			</div>
		)
	},
	render() {
		return this.buildRadialMenu(this.props, this.state);
	}
});

module.exports = RadialMenu;
