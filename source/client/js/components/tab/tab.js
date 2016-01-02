var Layer = require("js/components/layer");

var _mode = ["tab", "menu"];

var Tab = React.createClass({
	displayName: "Tab",
	propTypes: {
		mode: React.PropTypes.oneOf(_mode),
		children: React.PropTypes.node,
		className: React.PropTypes.string
	},
	getDefaultProps() {
		return {
			mode: _mode[0]
		}
	},
	getInitialState() {
		return {
			activeIndex: this.getActiveIndex(this.props.children)
		}
	},
	getActiveIndex(children) {
		var activeIndex = -1;
		React.Children.forEach(children, function (child, index) {
			activeIndex = child.props.active ? index : activeIndex
		});
		return activeIndex;
	},
	setActiveIndex(index) {
		if (this.props.mode == _mode[0]) {
			this.setState({
				activeIndex: index
			})
		} else {
			this.setState({
				activeIndex: index == this.state.activeIndex ? -1 : index
			})
		}
	},
	buildNav(state, props) {
		var comp = this;

		function buildNavItem(children) {
			return React.Children.map(children, (child, index)=> {
				if (child.type === Tab.Item) {
					var _className = cx({
						"nav-item": true,
						"active": index == state.activeIndex
					});
					try {
						return (
								<h6 className={_className} onClick={()=>comp.setActiveIndex(index)}>
									{child.props.title(child, index, index == state.activeIndex)}
								</h6>
						)
					} catch (e) {
						return (
								<h6 className={_className} onClick={()=>comp.setActiveIndex(index)}>
									{child.props.title}
								</h6>
						)
					}
				} else {
					return null;
				}
			});
		}

		return (
				<div className="nav-list">
					{buildNavItem(props.children)}
				</div>
		);
	},
	buildTab(state, props) {

		function buildTabItem(children) {
			return React.Children.map(children, function (child, index) {
				if (child.type === Tab.Item) {
					return React.cloneElement(child, {
						active: index == state.activeIndex
					});
				} else {
					return child
				}
			})
		}

		return (
				<div className="tab-list">
					{buildTabItem(props.children)}
				</div>
		);
	},
	buildLayer(state, props) {
		return ((props.mode == _mode[1]) && (state.activeIndex != -1)) ? (
				<Layer onClick={()=> this.setActiveIndex(-1)}/>
		) : null
	},
	render() {
		var _className = cx({
			"b-tab": true,
			[this.props.className]: !!this.props.className
		});
		return (
				<div className={_className}>
					{this.buildLayer(this.state, this.props)}
					{this.buildNav(this.state, this.props)}
					{this.buildTab(this.state, this.props)}
				</div>
		)
	}
});

Tab.Item = React.createClass({
	displayName: "Tab.Item",
	propTypes: {
		title: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.func
		]).isRequired,
		active: React.PropTypes.bool,
		className: React.PropTypes.string,
		children: React.PropTypes.node,
		onClick: React.PropTypes.func
	},
	render() {
		var _className = cx({
			"tab-item": true,
			"active": !!this.props.active,
			[this.props.className]: !!this.props.className
		});
		return this.props.active ? null : (
				<div className={_className}>
					{this.props.children}
				</div>
		)
	}
});

module.exports = Tab;
