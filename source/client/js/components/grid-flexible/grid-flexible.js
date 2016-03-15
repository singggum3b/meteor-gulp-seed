//===============================================
var boxpack = require("boxpack");
//===============================================

var Grid = React.createClass({
	displayName: "GridF",
	propTypes: {
		config: React.PropTypes.shape({}),
		getTransitionWrapper: React.PropTypes.func,
		fillGap: React.PropTypes.func,
		meta: React.PropTypes.object,
		onUpdate: React.PropTypes.func
	},
	statics: {
		/**
		 * @props CSSTransitionGroup props objects to override,except component attribute
		 */
		getTransitionWrapper(props) {
			var _defaultWrapper = <ReactCSSTransitionGroup component="div" transitionName="grid-animation"
																										 transitionAppear={false}
																										 transitionEnter={false} transitionLeave={false}/>;
			return props ? React.cloneElement(_defaultWrapper, props) : _defaultWrapper;
		},
		debounceSetState: $.debounce(500, function (newState, context) {
			context._isMounted && context.setState(newState);
		})
	},
	getDefaultProps() {
		return {
			getTransitionWrapper: ()=> {
				return Grid.getTransitionWrapper();
			}
		}
	},
	getInitialState() {
		return {
			containerWidth: 0,
			containerHeight: 0,
			itemPropertyList: [],
			fillerArray: [],
			itemPropsMap: this._tempItemPropsMap
		}
	},
	componentDidMount() {
		var newState = this.processGrid(this.props);
		this._isMounted = true;
		this.setState(Object.assign(newState, {
			containerWidth: this._grid.offsetWidth
		}));
	},
	componentWillUnmount() {
		this._isMounted = false;
	},
	componentWillReceiveProps(nextProps) {
		var newState = this.processGrid(nextProps);
		//====================================
		if (nextProps.fillGap && newState.fillerArray.length) {
			nextProps.fillGap && nextProps.fillGap(newState.fillerArray, newState.itemPropertyList.length, nextProps.meta);
			newState.itemPropertyList = [];
			newState.fillerArray = [];
		}
		this.setState(newState);
	},
	componentDidUpdate(prevProps, prevState) {

		var newState = {};
		//Update if childs has changed dimension
		//this.state.itemPropsMap && console.log(this.state.itemPropsMap.toJS());
		if (!Immutable.is(prevState.itemPropsMap, this.state.itemPropsMap)) {
			newState = this.processGrid(this.props);
		}
		//====================================
		if (this._grid) {
			var el = this._grid;
			if (Math.abs(el.offsetWidth - this.state.containerWidth) > 1) {
				newState.containerWidth = el.offsetWidth;
				//console.log(el.offsetWidth);
			}
			//====================================
			var containerHeight = this.getContainerHeight(this.state.itemPropertyList, el.offsetWidth, this.props);
			if ((Math.abs(containerHeight - this.state.containerHeight) > 1) && containerHeight != 0) {
				newState.containerHeight = containerHeight
			}

			//console.log(newState);

			if (Object.keys(newState).length !== 0) this.setState(newState);
		}
	},
	getContainerHeight(itemPropertyList, containerWidth, props) {
		var _containerWidth = containerWidth ? containerWidth : this.state.containerWidth;
		var _props = props ? props : this.props;
		return itemPropertyList.reduce(function (lastReturned, item) {
			var pivot = item.y + item.height;
			//console.log(pivot);
			if ((pivot) > lastReturned) {
				return pivot;
			} else return lastReturned;
		}, 0);
	},
	updateChildProps(childID, props){
		//console.log(childID,props);
		!this._tempItemPropsMap && (this._tempItemPropsMap = Immutable.Map());
		if (props && props.containerWidth != 0) {
			this._tempItemPropsMap = this._tempItemPropsMap.set(childID, Immutable.fromJS(props));
			Grid.debounceSetState({
				containerWidth: props.containerWidth,
				itemPropsMap: this._tempItemPropsMap
			}, this);
			/*this.setState({
			 containerWidth: props.containerWidth,
			 itemPropsMap: this._tempItemPropsMap
			 });*/
			//console.log(this._tempItemPropsMap);
		} else {
			//return;
		}

		//this._tempItemPropsMap = new Map();

	},
	processGrid(props) {

		//console.log(this.state.itemPropsMap && this.state.itemPropsMap.toJS() ,itemPropertyList);
		//Check unique child ids
		if (new Set(React.Children.toArray(props.children).map(function (child, index) {
				return child.props.config.id;
			})).size !== React.Children.count(props.children)) throw new Error("[ Grid-Flexible component ] Item id must be unique");

		//get the dimension array
		var itemPropertyList = [];
		React.Children.forEach(props.children, (child)=> {
			let childProps = this.state.itemPropsMap && this.state.itemPropsMap.get(child.props.config.id)
			childProps && itemPropertyList.push(childProps.toJS());
		});

		itemPropertyList = Immutable.fromJS(itemPropertyList).filterNot((x)=>x === undefined).toJS();
		//if (itemPropertyList.length != React.Children.count(props.children)) return {};

		//Fit in the layout
		this._bin = boxpack({
			width: (itemPropertyList && itemPropertyList[0]) ? itemPropertyList[0].containerWidth : this.state.containerWidth,
			algo: boxpack.algo.top
		});

		//console.log(this._grid.offsetWidth);
		itemPropertyList = this._bin.pack(itemPropertyList);
		//console.log(this._grid.offsetWidth,itemPropertyList);

		//Check for empty gap
		var fillerArray = [];
		for (var i = 0; i < this._bin._empty.length; i++) {
			var gap = this._bin._empty[i];
			if (isFinite(gap.width) && isFinite(gap.height)) {
				//console.log(this._bin._empty);
				//console.log(itemPropertyList);
				fillerArray.push(Object.assign({}, gap));
				//console.log(itemPropertyList);
				//console.log(fillerArray);
			}
		}

		//Get the height of bin
		var containerHeight = this.getContainerHeight(itemPropertyList, null, props);

		//this._tempItemPropsMap = new Map();
		return {
			containerHeight: containerHeight,
			itemPropertyList: itemPropertyList,
			fillerArray: fillerArray,
			//itemPropsMap: null,
			containerWidth: this._grid.offsetWidth
		};
	},
	processItem(childItems) {

		//Return processed items
		return React.Children.map(childItems, (child, index) => {
			if (child.type == Grid.Item) {
				//console.log(this.state.itemPropertyList[index]);

				return React.cloneElement(child, Object.assign({
					updateProps: this.updateChildProps,
					containerHeight: this.state.containerHeight,
					containerWidth: this.state.containerWidth
				}, this.state.itemPropertyList[index]));
			}
		});

	},
	gridRefs(dom) {
		if (dom) {
			this._grid = ReactDOM.findDOMNode(dom);
		}
	},
	buildGrid(props, state) {

		let _className = cx({
			"b-grid-flexible": true
		});

		let _style = {
			height: state.containerHeight,
			position: "relative"
		};

		return React.cloneElement(props.getTransitionWrapper(), {
			children: this.processItem(props.children),
			ref: this.gridRefs,
			className: _className,
			style: _style
		});
	},
	render() {
		return this.buildGrid(this.props, this.state);
	}
});

Grid.Item = React.createClass({
	displayName: "GridF.Item",
	propTypes: {
		//User only provide config object
		config: React.PropTypes.shape({
			id: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
			width: React.PropTypes.number.isRequired,
			widthType: React.PropTypes.oneOf(["px", "%"]).isRequired
		}).isRequired,
		//Internal use
		updateProps: React.PropTypes.func,
		containerHeight: React.PropTypes.number,
		containerWidth: React.PropTypes.number,
		x: React.PropTypes.number,
		y: React.PropTypes.number,
		width: React.PropTypes.number,
		height: React.PropTypes.number,
		children: React.PropTypes.node
	},
	componentDidMount() {
		this.updatePropsToParent(this.props, this.state);
	},
	componentDidUpdate(prevProps, prevState) {
		if (((prevProps.containerWidth !== this.props.containerWidth) && this.props.containerWidth) || isNaN(this.props.x)) {
			this.updatePropsToParent(this.props, this.state)
		}
	},
	updateGridItem() {
		this.updatePropsToParent(this.props, this.state);
	},
	updatePropsToParent(props, state) {
		if (this._dom) {
			//console.log(this.props.containerWidth, this.getItemWidth(this.props));
			let itemWidth = this.getItemWidth(props);
			//fast update dom dimension
			this._dom.style.height = "";
			this._dom.style.width = itemWidth;

			let _currentDimension = Immutable.fromJS({
				containerWidth: props.containerWidth,
				height: this._dom.getBoundingClientRect().height,
				width: this._dom.getBoundingClientRect().width
			});

			if (!Immutable.is(_currentDimension, this._previousDimension)) {
				//update to parent
				this._dom && this.props.updateProps(props.config.id, _currentDimension.toJS());
				this._previousDimension = _currentDimension;
			}
		}
	},
	itemRef(dom) {
		if (dom) {
			this._dom = dom;
		}
	},
	getItemWidth(props) {
		return mdx(props.config.widthType, {
			"px": ()=> {
				return props.config.width;
			},
			"%": ()=> {
				return props.config.width * 100 + "%";
			}
		});
	},
	buildItem(props, state) {
		let itemWidth = this.getItemWidth(props);

		var _itemStyle = (!isNaN(props.x)) ? {
			left: props.x,
			top: props.y,
			width: itemWidth,
			height: props.height,
			position: "absolute",
			opacity: 1
		} : {
			top: props.containerHeight,
			maxWidth: props.containerWidth,
			left: "50%",
			width: itemWidth,
			position: "fixed",
			visibility: "hidden",
			pointerEvents: "none",
			opacity: 0
		};

		return (
			<div ref={this.itemRef} style={_itemStyle} className="item">
				{React.cloneElement(this.props.children, {
					componentDOMReady: this.updateGridItem
				})}
			</div>
		);
	},
	render() {
		return this.buildItem(this.props, this.state);
	}

});

module.exports = Grid;
