var ProgressBar = require("../progress");
var Swipeable = require("react-swipeable");

var CarouselMultiple = React.createClass({
	displayName: "CarouselMultiple",
	propTypes: {
		autoPlay: React.PropTypes.number,
		visibleItemCount: React.PropTypes.number,
		children: React.PropTypes.node
	},
	getDefaultProps() {
		return {
			autoPlay: 0
		}
	},
	getInitialState() {
		return {
			activeGroup: 0,
			autoPlayTimestamp: Date.now(),
			currentTimestamp: Date.now(),
			lastDirection: undefined
		}
	},
	componentDidMount() {
		if (this.props.autoPlay) {
			this.setProgress(this.props, this.state);
			this.next();
		}
	},
	componentDidUpdate(prevProps, prevState) {
		if ((this.state.currentTimestamp == this.state.autoPlayTimestamp) && (prevState.activeGroup != this.state.activeGroup)) {
			this.setProgress(this.props, this.state);
		}
	},
	componentWillUnmount() {
		clearInterval(this._interval);
	},
	buildControl(props, state) {

		let _next = (
			<span className="next" key="next" onClick={()=>this.next(true)}>
					<img src={require("client/img/svg/next.svg")} alt="Next"/>
				</span>);
		let _prev = (
			<span className="prev" key="prev" onClick={()=>this.prev(true)}>
					<img src={require("client/img/svg/prev.svg")} alt="Prev"/>
				</span>);

		let circleList = this.getGroupedItemIndex(props, state).map((group, index)=> {
			var _className = cx({
				circle: true,
				active: index == this.state.activeGroup
			});
			return (
				<span className={_className} key={index} onClick={()=>this.navigate(index)}></span>
			)

		});

		let controlList = React.Children.count(props.children) >= props.visibleItemCount ? [_prev,
			<span key="circle-list" className="circle-list">{circleList}</span>, _next] : null;

		return controlList;
	},
	buildProgressBar(props, state) {
		var transitionDuration = (state.currentTimestamp == state.autoPlayTimestamp) ? 0 : props.autoPlay;
		//console.log(transitionDuration);
		return (props.autoPlay && (React.Children.count(props.children) > 1)) ? (
			<ProgressBar percent={this.getAutoPlayTimePercent(props,state)}
									 transitionDuration={props.autoPlay && transitionDuration}></ProgressBar>
		) : null;
	},
	getAutoPlayTimePercent(props, state) {
		//console.log(100 * (state.currentTimestamp - state.autoPlayTimestamp) / props.autoPlay);
		return 100 * (state.currentTimestamp - state.autoPlayTimestamp) / props.autoPlay;
	},
	setActiveGroup(index, direction) {
		var groupCount = this.getGroupCount(this.props, this.state);
		var _targetIndex = index;
		if (index >= groupCount) _targetIndex = 0;
		if (index < 0) _targetIndex = groupCount - 1;

		//console.log(_targetIndex);

		var timeStamp = Date.now();

		this.setState({
			prevIndex: this.state.activeGroup,
			activeGroup: _targetIndex,
			autoPlayTimestamp: timeStamp,
			currentTimestamp: timeStamp,
			lastDirection: direction
		});
	},
	setProgress(props, state) {
		if (props.autoPlay) {
			setTimeout(()=> {
				this.setState({
					currentTimestamp: state.autoPlayTimestamp + props.autoPlay
				})
			}, 10);

		}
	},
	navigate(index) {
		if (index != this.state.activeGroup) {
			clearInterval(this._interval);
			this.setActiveGroup(index);
			this.next();
		}
	},
	next(force) {
		clearInterval(this._interval);
		if (!force && !!this.props.autoPlay) {
			this._interval = setInterval(()=> {
				this.setActiveGroup(this.state.activeGroup + 1, "right");
			}, this.props.autoPlay);
		} else {
			this.setActiveGroup(this.state.activeGroup + 1, "right");
			//this.next();
		}
	},
	prev(force) {
		clearInterval(this._interval);
		if (!force && !!this.props.autoPlay) {
			clearInterval(this._interval);
			this._interval = setInterval(()=> {
				this.setActiveGroup(this.state.activeGroup - 1, "left");
			}, this.props.autoPlay);
		} else {
			this.setActiveGroup(this.state.activeGroup - 1, "left");
			//this.prev();
		}
	},
	onSwipingRight: $.debounce(200, function () {
		this.prev(true);
	}),
	onSwipingLeft: $.debounce(200, function () {
		this.next(true);
	}),
	buildTransitionName(props, state) {
		let groupCount = this.getGroupCount(props, state);
		let tailToHead = (state.activeGroup == 0 && state.prevIndex + 1 == groupCount && state.lastDirection == "right");
		let headToTail = (state.activeGroup + 1 == groupCount && state.prevIndex == 0 && state.lastDirection == "left");
		if (headToTail || tailToHead) {
			return cx({
				"carousel-animation": tailToHead,
				"carousel-animation-reverse": headToTail
			})
		} else {
			return cx({
				"carousel-animation": (state.activeGroup > state.prevIndex),
				"carousel-animation-reverse": (state.activeGroup < state.prevIndex)
			})
		}

	},
	getGroupCount(props, state) {
		let {visibleItemCount} = props;
		let childCount = React.Children.count(props.children);
		return Math.ceil(childCount / visibleItemCount);
	},
	getGroupedItemIndex(props, state) {
		let {visibleItemCount} = props;
		let childCount = React.Children.count(props.children);
		let groupCount = this.getGroupCount(props, state);
		return Immutable.Range(0, groupCount).toList().map((groupNumber, index)=> {
			return ((groupNumber + 1) >= groupCount) ?
				Immutable.Range(childCount - visibleItemCount, childCount).toList()
				:
				Immutable.Range(visibleItemCount * groupNumber, visibleItemCount * (groupNumber + 1)).toList()
		});
	},
	getActiveGroupItem(props, state) {
		let {activeGroup} = state;
		let {visibleItemCount} = props;
		let childCount = React.Children.count(props.children);
		let groupCount = Math.ceil(childCount / visibleItemCount);
		let groupedIndex = this.getGroupedItemIndex(props, state);
		let childArray = React.Children.toArray(props.children);
		let lastCombinedItemList = [];

		//console.log(groupedIndex.toJS());
		lastCombinedItemList = groupedIndex.get(activeGroup).map((index)=> {
			return childArray[index]
		});

		//console.log(groupedIndex.toJS(),lastCombinedItemList.toJS());
		return lastCombinedItemList.filter((val)=>!!val);

	},
	buildChildren(props, state) {
		var _resultChild;
		try {
			_resultChild = React.Children.only(props.children)
		} catch (e) {
			_resultChild = (
				<div className="item-group" key={state.activeGroup}>
					{
						this.getActiveGroupItem(props, state).toJS().map((child, index)=> {
							return child ? React.cloneElement(child, {
								width: child.props.width ? child.props.width : 100 / props.visibleItemCount + "%",
								left: (index) * 100 / props.visibleItemCount + "%",
							}) : null
						})
					}
				</div>
			)
		}
		return _resultChild;
	},
	buildCarousel(props, state) {
		//console.log(this.buildTransitionName(props,state));
		let _className = cx({
			"b-carousel b-carousel--multiple": true,
			[props.className]: !!props.className
		});
		return React.Children.count(props.children) ? (
			<div className={_className}>
				{this.buildProgressBar(props, state)}


				<ReactCSSTransitionGroup component={Swipeable}
																 onSwipingLeft={this.onSwipingLeft}
																 onSwipingRight={this.onSwipingRight}
																 delta={100}
																 className="item-container"
																 transitionAppear={true}
																 transitionEnter={true}
																 transitionLeave={true}
																 transitionAppearTimeout={1000}
																 transitionEnterTimeout={1000} transitionLeaveTimeout={1000}
																 transitionName={this.buildTransitionName(props,state)}>
					{this.buildChildren(props, state)}
				</ReactCSSTransitionGroup>

				<div className="control-container">
					{this.buildControl(props, state)}
				</div>
			</div>
		) : null;
	},
	render() {
		return this.buildCarousel(this.props, this.state);
	}
});

CarouselMultiple.Item = React.createClass({
	displayName: "CarouselMultiple.Item",
	propTypes: {
		width: React.PropTypes.string
	},
	render() {
		let _style = {
			width: this.props.width,
			left: this.props.left
		};

		return (
			<div className="item" style={_style}>
				{this.props.children}
			</div>
		)
	}
});

module.exports = CarouselMultiple;
