var Layer = require("client/js/components/layer");

var Accordion = React.createClass({
	displayName: "Accordion",
	propTypes: {
		children: React.PropTypes.node,
		className: React.PropTypes.string
	},
	getDefaultProps() {
		return {}
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
		this.setState({
			activeIndex: index == this.state.activeIndex ? -1 : index
		});
	},
	buildComponent(props, state) {
		let _className = cx({
			"b-accordion": true,
			[this.props.className]: !!props.className
		});
		return (
			<div className={_className}>
				{
					React.Children.map(props.children, (child, index)=> {
						if (child.type === Accordion.Item) {
							let _className = cx({
								"active": index == state.activeIndex
							});

							return React.cloneElement(child, {
								className: _className,
								active: index == state.activeIndex,
								index: index,
								setActiveIndex: this.setActiveIndex
							});
						} else {
							return child;
						}
					})
				}
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Accordion.Item = React.createClass({
	displayName: "Accordion.Item",
	propTypes: {
		title: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.func
		]).isRequired,
		active: React.PropTypes.bool,
		className: React.PropTypes.string,
		children: React.PropTypes.node,
		//Internal use
		index: React.PropTypes.number,
		setActiveIndex: React.PropTypes.func,
		onClick: React.PropTypes.func
	},
	buildComponent(props, state) {
		let _className = cx({
			"item": true,
			"active": !!this.props.active,
			[this.props.className]: !!this.props.className
		});
		return (
			<div className={_className}>
				<div className="item-title" onClick={()=>{
					props.setActiveIndex(props.index);
					props.onClick && props.onClick(props.index)
					}}>
					{(()=> {
						try {
							return props.title(props, state);
						} catch (e) {
							return props.title;
						}
					})()}
				</div>
				{props.active && <div className="item-body">
					{props.children}
				</div>}
			</div>
		)
	},
	render() {

		return this.buildComponent(this.props, this.state);

	}
});

module.exports = Accordion;
