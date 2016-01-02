var RadialMenu = React.createClass({
	displayName: "RadialMenu",
	propTypes: {
		list: React.PropTypes.object,
		onClick: React.PropTypes.func,
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
	buildItemStyle(list, item, index) {
		var centralAngle = 360 / list.size;
		centralAngle = centralAngle > 90 ? 90 : centralAngle;
		if (centralAngle == 90 && list.size < 4) {
			return {
				transform: `rotate(${centralAngle * index - (centralAngle / 2) * (list.size)}deg)`,
				WebkitTransform: `rotate(${centralAngle * index - (centralAngle / 2) * (list.size)}deg)`
			}
		} else {
			return {
				transform: `rotate(${centralAngle * index}deg) skew(${90 - centralAngle}deg)`,
				WebkitTransform: `rotate(${centralAngle * index}deg) skew(${90 - centralAngle}deg)`
			}
		}
	},
	buildItemContentStyle(list, item, index) {
		var centralAngle = 360 / list.size;
		centralAngle = centralAngle > 90 ? 90 : centralAngle;
		return {
			transform: `skew(${-90 + centralAngle}deg)`,
			WebkitTransform: `skew(${-90 + centralAngle}deg)`
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
				<div className="b-radialmenu">
					<div className="b-radialmenu-mask">
						<div className="b-radialmenu-wrapper">
							{this.buildMenuCenter(this.props, this.state)}
							{
								props.list.map((item, index)=> {
									var itemClass=cx({
										"item": true,
										"-active": index == props.selectedIndex
									});
									return (
											<div onClick={(e)=>{this.onClickItem(item,index)}} key={index} className={itemClass}
													 style={this.buildItemStyle(props.list,item,index+1)}>
												<div className="item-content" style={this.buildItemContentStyle(props.list,item,index+1)}>
													{item.get("title")}
													<img className="item-image" src={item.get("img")} alt={item.get("title")}/>
												</div>
											</div>
									)
								})
							}
						</div>
					</div>
				</div>
		)
	},
	render() {
		return this.buildRadialMenu(this.props, this.state);
	}
});

module.exports = RadialMenu;
