var Layer = require("client/js/components/layer");

var _mode = ["text", "image", "both"];

var Button = React.createClass({
	displayName: "Button",
	propTypes: {
		icon: React.PropTypes.string,
		iconActive: React.PropTypes.string,
		iconHover: React.PropTypes.string,
		title: React.PropTypes.string.isRequired,
		altTitle: React.PropTypes.string,
		URL: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		list: React.PropTypes.object,
		active: React.PropTypes.bool,
		mode: React.PropTypes.oneOf(_mode),
		childMode: React.PropTypes.oneOf(_mode),
		onClick: React.PropTypes.func,
		onKeyUp: React.PropTypes.func,
		showList: React.PropTypes.bool,
		target: React.PropTypes.string,
		preventDefault: React.PropTypes.bool,
		disable: React.PropTypes.bool,
		tabIndex: React.PropTypes.string
	},
	getDefaultProps() {
		return {
			mode: _mode[0],
			childMode: _mode[0],
			showList: true,
			preventDefault: true,
			tabIndex: "0"
		}
	},
	getInitialState() {
		return {
			active: !!this.props.active,
			hover: false
		}
	},
	onKeyUp(e) {
		this.props.onKeyUp && this.props.onKeyUp(e);
	},
	setActiveState(isActive) {
		//console.log(isActive);
		this.setState({
			active: isActive
		});
	},
	componentWillReceiveProps(nextProps) {
		if (nextProps.active !== this.props.active) this.setState({
			active: nextProps.active
		});
	},
	onClick(e) {
		if (this.props.disable) return;
		if (!this.props.URL || !this.props.preventDefault) {
			if (e.touches && e.touches.length && this.props.preventDefault) e.preventDefault();
			this.setActiveState(!this.state.active);
			this.props.onClick && this.props.onClick(e);
		}
	},
	onMouseOver(e) {
		this.setState({hover: true});
	},
	onMouseOut(e) {
		this.setState({hover: false});
	},
	buildClassName(state, props) {
		return cx({
			"b-button": true,
			"active": state.active,
			"disabled": props.disable,
			[props.className]: !!props.className
		});
	},
	buildButton(state, props) {
		var className = cx({
			"button": true,
			["button--" + props.mode]: true,
			"is-hover": state.hover
		});
		var href = (!props.list) ? props.URL : undefined;
		var icon = (state.active && props.iconActive) ? props.iconActive : (props.iconHover ? (state.hover ? props.iconHover : props.icon) : props.icon);
		var target = props.target;

		return mdx(props.mode, {
			[_mode[0]]: ()=> {
				return (
					<a className={className} href={href} target={target} onClick={this.onClick}
						 tabIndex={props.tabIndex} onKeyUp={props.onKeyUp}
						 onMouseEnter={this.onMouseOver} onMouseLeave={this.onMouseOut}>
						<span className="title" dangerouslySetInnerHTML={{__html: props.title}}></span>
						{!!props.altTitle && <span className="alt-title">{props.altTitle}</span>}
					</a>
				)
			},
			[_mode[1]]: ()=> {
				return (
					<a className={className} href={href} target={target} onClick={this.onClick} onTouchStart={this.onClick}
						 onMouseEnter={this.onMouseOver} onMouseLeave={this.onMouseOut}>
						<div className="icon-wrapper">
							<img className="icon" src={icon} alt={props.URL || "Icon"}/>
						</div>
					</a>
				)
			},
			[_mode[2]]: ()=> {
				return (
					<a className={className} href={href} target={target} onClick={this.onClick} onTouchStart={this.onClick}
						 onMouseEnter={this.onMouseOver} onMouseLeave={this.onMouseOut}>
							<span className="icon-wrapper">
								<img className="icon" src={icon} alt={props.URL || "Icon"}/>
							</span>
							<span className="title-wrapper">
								<span className="title" dangerouslySetInnerHTML={{__html: props.title}}></span>
								{!!props.altTitle && <span className="alt-title">{props.altTitle}</span>}
							</span>
					</a>
				)
			}
		})
	},
	buildChildList(state, props) {
		//console.log(props.list, state.active , props.showList);
		return (props.list && state.active && props.showList) && (
				<div className="button-list">
					{props.list.map((value, index)=> {
						return (
							<Button key={index} {...value.toObject()}
											mode={props.childMode ? props.childMode : props.mode}></Button>
						)
					})}
				</div>
			)
	},
	buildLayer(state, props) {
		return (state.active && !!props.list && props.showList) && (
				<Layer onClick={()=>{
						this.setActiveState(false);
						props.onClick && props.onClick();
						}} allowTouchMove={!props.preventDefault}></Layer>
			)
	},
	render() {
		return (
			<div className={this.buildClassName(this.state,this.props)}>
				{this.buildLayer(this.state, this.props)}
				{this.buildButton(this.state, this.props)}
				{this.buildChildList(this.state, this.props)}
			</div>
		)
	}
});

module.exports = Button;
