var Nav = React.createClass({
	displayName: "Nav",
	propTypes: {
		tree: React.PropTypes.object.isRequired,
		activePosition: React.PropTypes.object,
		buildItem: React.PropTypes.func,
		buildLevel: React.PropTypes.func,
		shouldShowLevel: React.PropTypes.func,
		onMount: React.PropTypes.func,
		onChange: React.PropTypes.func,
		className: React.PropTypes.string,
		style: React.PropTypes.string
	},
	statics: {
		//Assign leaf with its position on the tree
		processTree: function processTree(tree, position = Immutable.fromJS([])) {
			return tree.map(function (value, index) {
				var _position = position.concat([index]);
				if (value.get("list")) {
					return value.withMutations(function (value) {
						value.set("$position", _position)
								.set("hasChild", true)
								.update("list", function (list) {
									return processTree(list, _position);
								});
					})
				} else {
					return value.withMutations(function (value) {
						value.set("hasChild", false).set("$position", _position);
					})
				}
			});
		},
		//Flatten & sort the array by level
		flattenTree: function flattenTree(processedTree, flatted) {
			var f = flatted ? flatted : Immutable.fromJS([]);
			return processedTree.reduce(function (lastValue, value) {
				if (value.get("list")) {
					var temp = flattenTree(value.get("list"));
					return lastValue.concat(temp).concat([value.set("list", undefined)]);
				} else {
					return lastValue.concat([value]);
				}
			}, f).sortBy(function (leaf) {
				return leaf.get("$position").size;
			});
		}
	},
	getDefaultProps() {
		return {
			activePosition: Immutable.fromJS([]),
			shouldShowLevel: function (activeLevel, currentLevel, childCount) {
				return ((activeLevel + 1) >= 1 * currentLevel && childCount)
			},
			buildItem: function (item, index, isActive) {
				return index;
			},
			buildLevel: function (levelKey, levelChild) {
				return (
						<div key={`level-${levelKey}`} className={`level-${levelKey} fadeInDown animated`}>
							<ul>
								{levelChild}
							</ul>
						</div>
				)
			}
		}
	},
	getInitialState() {
		var _processedTree = Nav.processTree(this.props.tree);
		return {
			processedTree: _processedTree,
			flattenTree: Nav.flattenTree(_processedTree)
		}
	},
	componentDidMount() {
		$.debounce(100, ()=> {
			this.props.onMount && this.props.onMount(this.state);
		})();
	},
	componentWillReceiveProps(nextProps) {
		var _processedTree = Nav.processTree(nextProps.tree);
		this.setState({
			processedTree: _processedTree,
			flattenTree: Nav.flattenTree(_processedTree)
		});
		$.debounce(100, ()=> {
			this.props.onChange && this.props.onChange(Object.assign({}, this.state, {
				processedTree: _processedTree,
				flattenTree: Nav.flattenTree(_processedTree)
			}));
		})();
	},
	buildChild() {

		var _groupedTree = this.state.flattenTree.groupBy(leaf => leaf.get("$position").size);
		//console.log(_processedTree.toJS());
		//console.log(flattenTree(_processedTree).size);

		var _activePos = this.props.activePosition;

		//Build child
		return _groupedTree.map((level, key) => {

			var _levelChilds = level.map((item, index, iter) => {
				var _itemPos = item.get("$position");
				var _matchPos = _itemPos.zipWith(function (a, b) {
					return a == b
				}, _activePos).reduce(function (total, value, index) {
					return (index == total) ? (value ? total + 1 : total) : total;
				}, 0);
				var _itemContent = this.props.buildItem(item, index, _matchPos == _itemPos.size);

				//console.log(_itemPos.toJS(),_activePos.toJS(),_matchPos);

				var _className = cx({
					"item": true,
					"active": (_matchPos == _itemPos.size) || _itemContent.props.active,
					"has-child": item.get("hasChild")
				});

				//Show item which either : on level 1 , is active , or child of activated item
				return (_matchPos > 0 && _itemPos.size - 1 == _matchPos || _matchPos == _itemPos.size || _itemPos.size <= 1) ? (
						<li key={index} className={_className}>
							{_itemContent}
						</li>
				) : null;

			}).filter(v => !!v);

			return this.props.shouldShowLevel(_activePos.size, key, _levelChilds.size) ? this.props.buildLevel(key, _levelChilds) : null;

		}).toList();

	},
	render() {
		var _className = cx({
			"b-nav": true,
			[this.props.className]: !!this.props.className
		});

		return this.props.tree ? (
				<div style={this.props.style} className={_className}>
					{this.buildChild()}
				</div>
		) : null;
	}
});

Nav.Tree = React.createClass({
	displayName: "Nav.Tree",
	render() {
		return (
				<div></div>
		);
	}
});

module.exports = Nav;
