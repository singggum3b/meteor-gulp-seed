var CSSTransitionGroup = React.addons.CSSTransitionGroup;

var Cycler = React.createClass({
	displayName: "Cycler",
	propTypes: {
		list: React.PropTypes.object,
		onCycling: React.PropTypes.func,
		activeIndex: React.PropTypes.number,
		buildItem: React.PropTypes.func,
		buildNavigation: React.PropTypes.func
	},
	getDefaultProps() {
		return {
			buildItem: (value, index, activeIndex)=> {
				console.log(value.toJS(), activeIndex);
				return <span>{value.get("$index")}</span>
			},
			buildNavigation: (context)=> {
				var nextIndex = (context.state.activeIndex + 1) >= context.state.parsedList.size ? 0 : (context.state.activeIndex + 1);
				var prevIndex = (context.state.activeIndex - 1) < 0 ? (context.state.parsedList.size - 1) : (context.state.activeIndex - 1);
				var next = (
					<div className="next" onClick={()=>context.setActive(nextIndex)}>
						<img src="/img/svg/right1.svg" alt="Next"/>
					</div>
				);
				var prev = (
					<div className="prev" onClick={()=>context.setActive(prevIndex)}>
						<img src="/img/svg/left1.svg" alt="Prev"/>
					</div>
				);
				return {
					next: next,
					prev: prev
				}
			}
		}
	},
	getInitialState() {
		var activeIndex = this.props.activeIndex ? this.props.activeIndex : 0;
		var parsedList = this.props.list.map((val, index)=> {
			return val.set("$index", index);
		});
		return {
			activeIndex: activeIndex,
			parsedList: parsedList,
			sortedList: this.getSortedList(parsedList, activeIndex)
		}
	},
	getSortedList(list, activeIndex) {
		function circleMove(list, times, isBackward) {
			if (times > 0) {
				if (isBackward) {
					return circleMove(list.shift().push(list.first()), times - 1, isBackward);
				} else {
					return circleMove(list.unshift(list.last()).pop(), times - 1, isBackward);
				}
			} else {
				return list;
			}
		}

		var listSize = list.size;
		var midIndex = Math.ceil(listSize / 2) - 1;
		if (activeIndex > midIndex) {
			return circleMove(list, activeIndex - midIndex, true);
		} else {
			return circleMove(list, midIndex - activeIndex, false);
		}
	},
	setActive(index) {
		this.setState({
			activeIndex: index,
			sortedList: this.getSortedList(this.state.parsedList, index)
		});
		!!this.props.onCycling && this.props.onCycling(index)
	},
	onCycling(item, currentIndex) {
		this.setActive(item.get("$index"));
	},
	buildItemList(list, props, state) {
		return list.size ? list.map((value, index)=> {
			return (
				<div className={cx({"item" : true,"active": state.activeIndex == value.get("$index")})}
						 onClick={()=>this.onCycling(value,index)} key={"item-" + value.get("$index")}>
					{props.buildItem(value, index, state.activeIndex)}
				</div>
			)
		}) : null
	},
	buildParts(props, state) {
		var listSize = state.sortedList.size;
		var midIndex = Math.ceil(listSize / 2) - 1;
		var head = state.sortedList.take(midIndex);
		var mid = state.sortedList.slice(midIndex, midIndex + 1);
		var tail = state.sortedList.takeLast(listSize - midIndex - 1);
		var navigation = this.props.buildNavigation(this);

		return (
			<div className="wrapper">
				<CSSTransitionGroup component="div" className="part head" transitionName="cycler-animation">
					{this.buildItemList(head, props, state)}
				</CSSTransitionGroup>
				{navigation.prev}
				<CSSTransitionGroup component="div" className="part mid" transitionName="cycler-animation">
					{this.buildItemList(mid, props, state)}
				</CSSTransitionGroup>
				{navigation.next}
				<CSSTransitionGroup component="div" className="part tail" transitionName="cycler-animation">
					{this.buildItemList(tail, props, state)}
				</CSSTransitionGroup>
			</div>
		)
	},
	render() {
		return (
			<div className="b-cycler">
				{this.buildParts(this.props, this.state)}
			</div>
		)
	}
});

module.exports = Cycler;
