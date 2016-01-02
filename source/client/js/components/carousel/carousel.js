var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var ProgressBar = require("../progress");
var Swipeable = require("react-swipeable");

var Carousel = React.createClass({
	displayName: "Carousel",
	propTypes: {
		autoPlay: React.PropTypes.number,
		children: React.PropTypes.node
	},
	getDefaultProps() {
		return {
			autoPlay: 0
		}
	},
	getInitialState() {
		return {
			activeIndex: 0,
			autoPlayTimestamp: Date.now(),
			currentTimestamp: Date.now()
		}
	},
	componentDidMount() {
		if (this.props.autoPlay) {
			this.setProgress(this.props, this.state);
			this.next();
		}
	},
	componentDidUpdate(prevProps, prevState) {
		if ((this.state.currentTimestamp == this.state.autoPlayTimestamp) && (prevState.activeIndex != this.state.activeIndex)) {
			this.setProgress(this.props, this.state);
		}
	},
	componentWillUnmount() {
		clearInterval(this._interval);
	},
	buildChildren(props) {
		var _resultChild;
		try {
			_resultChild = React.Children.only(props.children)
		} catch (e) {
			_resultChild = props.children.toArray()[this.state.activeIndex];
		}
		return _resultChild ? React.cloneElement(_resultChild, {key: _resultChild.props.key ? _resultChild.props.key : this.state.activeIndex}) : null;
	},
	buildControl(props) {

		var _next = (
				<span className="next" key="prev" onClick={()=>this.next(true)}>
					<img src="/img/svg/right1.svg" alt="Next"/>
				</span>);
		var _prev = (
				<span className="prev" key="next" onClick={()=>this.prev(true)}>
					<img src="/img/svg/left1.svg" alt="Prev"/>
				</span>);

		var circleList = React.Children.map(props.children, (child, index)=> {
			var _className = cx({
				circle: true,
				active: index == this.state.activeIndex
			});
			return (
					<span className={_className} key={index} onClick={()=>this.navigate(index)}></span>
			)
		});

		var controlList = React.Children.count(props.children) > 1 ? [_prev,
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
	setActiveIndex(index) {
		var childCount = React.Children.count(this.props.children);
		var _targetIndex = index;
		if (index >= childCount) _targetIndex = 0;
		if (index < 0) _targetIndex = childCount - 1;

		//console.log(_targetIndex);

		var timeStamp = Date.now();

		this.setState({
			prevIndex: this.state.activeIndex,
			activeIndex: _targetIndex,
			autoPlayTimestamp: timeStamp,
			currentTimestamp: timeStamp
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
		if (index != this.state.activeIndex) {
			clearInterval(this._interval);
			this.setActiveIndex(index);
			this.next();
		}
	},
	next(force) {
		clearInterval(this._interval);
		if (!force && !!this.props.autoPlay) {
			this._interval = setInterval(()=> {
				this.setActiveIndex(this.state.activeIndex + 1);
			}, this.props.autoPlay);
		} else {
			this.setActiveIndex(this.state.activeIndex + 1);
			this.next();
		}
	},
	prev(force) {
		clearInterval(this._interval);
		if (!force && !!this.props.autoPlay) {
			clearInterval(this._interval);
			this._interval = setInterval(()=> {
				this.setActiveIndex(this.state.activeIndex - 1);
			}, this.props.autoPlay);
		} else {
			this.setActiveIndex(this.state.activeIndex - 1);
			this.prev();
		}
	},
	onSwipingRight: $.debounce(200, function () {
		this.next(true);
	}),
	onSwipingLeft: $.debounce(200, function () {
		this.prev(true);
	}),
	buildTransitionName(state) {
		return cx({
			"carousel-animation": state.activeIndex > state.prevIndex,
			"carousel-animation-reverse": state.activeIndex < state.prevIndex
		})
	},
	render() {
		return (
				<div className="b-carousel">
					{this.buildProgressBar(this.props, this.state)}
					<CSSTransitionGroup component={Swipeable}
															onSwipingLeft={this.onSwipingLeft}
															onSwipingRight={this.onSwipingRight}
															delta={100}
															className="item-container"
															transitionName={this.buildTransitionName(this.state)}>
						{this.buildChildren(this.props)}
					</CSSTransitionGroup>

					<div className="control-container">
						{this.buildControl(this.props)}
					</div>
				</div>
		)
	}
});

module.exports = Carousel;
