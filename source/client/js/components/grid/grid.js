//===============================================
var boxpack = require("boxpack");
//===============================================
var CSSTransition = React.addons.CSSTransitionGroup;

var Grid = React.createClass({
	displayName: "Grid",
	propTypes: {
		config: React.PropTypes.shape({
			gridWidth: React.PropTypes.number.isRequired,
			ratio: React.PropTypes.number.isRequired
		}).isRequired,
		getTransitionWrapper: React.PropTypes.func,
		fillGap: React.PropTypes.func,
		meta: React.PropTypes.object
	},
	statics: {
		/**
		 * @props CSSTransitionGroup props objects to override,except component attribute
		 */
				getTransitionWrapper(props) {
			var _defaultWrapper = <CSSTransition component="div" transitionName="grid-animation" transitionAppear={false}
																					 transitionEnter={false} transitionLeave={false}/>;
			return props ? React.cloneElement(_defaultWrapper, props) : _defaultWrapper;
		}
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
			fillerArray: []
		}
	},
	componentDidMount() {
		var newState = this.processGrid(this.props);
		this.setState(newState);
	},
	componentWillReceiveProps(nextProps) {
		var newState = this.processGrid(nextProps);
		//====================================
		if (nextProps.fillGap && newState.fillerArray.length) {
			nextProps.fillGap && nextProps.fillGap(newState.fillerArray, newState.itemPropertyList.length, nextProps.meta);
			newState.itemPropertyList = [];
			newState.fillerArray = []
		}
		this.setState(newState);
	},
	componentDidUpdate(prevProps, prevState) {
		var newState = {};
		//====================================
		if (this.refs.grid) {
			var el = this.refs.grid.getDOMNode();
			if (Math.abs(el.offsetWidth - this.state.containerWidth) > 1) {
				newState.containerWidth = el.offsetWidth
			}
			//====================================
			var containerHeight = this.getContainerHeight(this.state.itemPropertyList, el.offsetWidth, this.props);
			if ((Math.abs(containerHeight - this.state.containerHeight) > 1) && containerHeight != 0) {
				newState.containerHeight = containerHeight
			}

			if (Object.keys(newState).length !== 0) this.setState(newState);
		}
	},
	getContainerHeight(itemPropertyList, containerWidth, props) {
		var _containerWidth = containerWidth ? containerWidth : this.state.containerWidth;
		var _props = props ? props : this.props;
		var _height = itemPropertyList.reduce(function (lastReturned, item) {
			var pivot = item.y + item.height;
			//console.log(pivot);
			if ((pivot) > lastReturned) {
				return pivot;
			} else return lastReturned;
		}, 0);

		return Math.floor(_containerWidth / _props.config.gridWidth) * _height;
	},
	processGrid(props) {

		//get the dimension array
		var itemPropertyList = [];
		React.Children.forEach(props.children, (child)=> {
			itemPropertyList.push({
				width: child.props.config.width,
				height: child.props.config.height
			});
		});

		//Fit in the layout
		this._bin = boxpack({
			width: props.config.gridWidth,
			algo: boxpack.algo.top
		});

		//console.log(this.props.config.gridWidth);
		itemPropertyList = this._bin.pack(itemPropertyList);
		//console.log(props.config.gridWidth,itemPropertyList);

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

		return {
			containerHeight: containerHeight,
			itemPropertyList: itemPropertyList,
			fillerArray: fillerArray
		};
	},
	processItem(childItems) {

		//Return processed items
		return React.Children.map(childItems, (child, index) => {
			if (child.type == Grid.Item) {
				//console.log(itemPropertyList[index]);

				return React.cloneElement(child, Object.assign({
					config: this.props.config,
					containerHeight: this.state.containerHeight,
					containerWidth: this.state.containerWidth
				}, this.state.itemPropertyList[index]));
			}
		});

	},
	render() {
		var _props = this.props;

		var _className = cx({
			"b-grid": true
		});

		var _style = {
			height: this.state.containerHeight
		};

		var _resultGrid = React.cloneElement(this.props.getTransitionWrapper(), {
			children: this.processItem(_props.children),
			ref: "grid",
			className: _className,
			style: _style
		});

		return _props.config.gridWidth ? (
				_resultGrid
		) : null;
	}
});

Grid.Item = React.createClass({
	displayName: "Grid.Item",
	propTypes: {
		config: React.PropTypes.shape({
			ratio: React.PropTypes.number,
			gridWidth: React.PropTypes.number
		}).isRequired,
		containerWidth: React.PropTypes.number,
		x: React.PropTypes.number,
		y: React.PropTypes.number,
		width: React.PropTypes.number,
		height: React.PropTypes.number,
		children: React.PropTypes.node
	},
	render() {
		var _props = this.props;
		var _colWidth = (_props.containerWidth / _props.config.gridWidth);
		var _rowHeight = Math.floor(_colWidth / _props.config.ratio);
		var _itemStyle = {
			left: (100 * _props.x / _props.config.gridWidth) + "%",
			width: (100 * _props.width / _props.config.gridWidth) + "%",
			top: _rowHeight * _props.y,
			height: _rowHeight * _props.height
		};

		return (
				<div ref={"item"} style={_itemStyle} className="item">
					{this.props.children}
				</div>
		);
	}

});

module.exports = Grid;
