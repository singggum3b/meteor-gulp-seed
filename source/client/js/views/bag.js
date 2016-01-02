//==================FLUX=========================
var Reactor = require("js/reactor.js");
var BagStore = require("js/bag-store");
//====================Components=======================
var RadialMenu = require("js/components/radialmenu-svg");
var Layer = require("js/components/layer");
var Button = require("js/components/button");
//====================================================

const Bag = React.createClass({
	displayName: "Bag",
	mixins: [Reactor.ReactMixin],
	propTypes: {
		mode: React.PropTypes.oneOf(["preview", "config"]),
		size: React.PropTypes.oneOf(["small", "medium", "large"])
	},
	getDataBindings() {
		return {
			bagData: BagStore.getters.bagData,
			selectedBagOptions: BagStore.getters.selectedBagOptions
		}
	},
	getInitialState() {
		return {
			width: undefined
		}
	},
	componentDidMount() {
		this.updateWidth();
	},
	componentWillReceiveProps() {
		this.updateWidth();
	},
	updateWidth() {
		$(this.refs.bag).width("");
		var newWidth = this.refs.bag.offsetWidth;
		newWidth = newWidth > $(window).height() ? $(window).height() : newWidth;
		$(this.refs.bag).width(newWidth);
		this.setState({
			width: newWidth
		})
	},
	getBagStyle(state){
		return {
			top: 0,
			left: 0,
			width: state.width,
			height: state.width
		}
	},
	buildBagFeature(props, state, feature) {
		var featureOpt = state.selectedBagOptions.get(feature);
		if (featureOpt) {
			return featureOpt.get("img") && <ReactCanvas.Image key={feature + featureOpt.get("index")} style={this.getBagStyle(state)}
																									 src={featureOpt.get("img")}></ReactCanvas.Image>
		} else {
			return null
		}
	},
	buildBag(props, state) {
		var bagFeature = state.selectedBagOptions.delete("size").reduce((reduction,value,key)=>value ? reduction.push(key): reduction,Immutable.fromJS([]));
		return state.width ? (
				<div ref="bag" className="v-bag" style={{width: state.width }}>
					<Bag.BagControl size={props.size} width={state.width}></Bag.BagControl>
					<ReactCanvas.Surface left={0} top={0} width={state.width} height={state.width}>
						<ReactCanvas.Image style={this.getBagStyle(state)} src="/img/bag.png"></ReactCanvas.Image>
						{bagFeature.map((feature)=> {
							return this.buildBagFeature(props, state, feature);
						})}
					</ReactCanvas.Surface>
				</div>
		) : (
				<div ref="bag" className="v-bag">
					{"Loading Bag.."}
				</div>
		);
	},
	render() {
		return this.buildBag(this.props, this.state);
	}
});

//====================================================

Bag.PaletteTrigger = React.createClass({
	displayName: "Bag_PaletteTrigger",
	propTypes: {
		position: React.PropTypes.object,
		onClick: React.PropTypes.func
	},
	buildTrigger(props, state) {
		var style = {
			left: props.position.get(0),
			top: props.position.get(1)
		};
		return (
				<div className="v-palette-trigger" style={style}>
					<a onClick={props.onClick}><span>[+]</span></a>
					{this.props.children}
				</div>
		)
	},
	render() {
		return this.buildTrigger(this.props, this.state)
	}
});

//====================================================

Bag.BagControl = React.createClass({
	displayName: "Bag_BagControl",
	propTypes: {
		width: React.PropTypes.number,
		size: React.PropTypes.oneOf(["small", "medium", "large"])
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		return {
			bagData: BagStore.getters.bagData,
			selectedBagOptions: BagStore.getters.selectedBagOptions
		}
	},
	setBagOptions(item, index, type) {
		BagStore.actions.setBagOptions({[type]: item.set("index",index)});
	},
	getPointPosition(originalPos, ratio) {
		return originalPos.map((pos, index)=> {
			return pos * ratio;
		})
	},
	togglePalette(type, isShow) {
		BagStore.actions.togglePalette(type, isShow);
	},
	buildRadialPalette(feature, index) {
		var {meta,list}= feature.toObject();
		var optionList = list.map((option, index)=> {
			return option.set("value", index)
					.set("img", option.get("thumbnail"));
		});
		return meta.get("paletteOpened") ? (
				<RadialMenu key={meta.get("type")}
										onClick={(item,index)=>this.setBagOptions(list.get(index),index,meta.get("type"))}
										onClickOutside={()=>this.togglePalette(meta.get("type"),false)}
										selectedIndex={this.state.selectedBagOptions.getIn([meta.get("type"),"index"])}
										list={optionList}></RadialMenu>
		) : (null)
	},
	buildBagTriggerPoint(feature,index) {

		var {meta}= feature.toObject();
		var {activePosition,originalSize} = meta.toObject();
		var triggerPos = this.getPointPosition(activePosition, this.props.width / originalSize.get(0));
		return (
				<Bag.PaletteTrigger key={index} position={triggerPos}
														onClick={()=>this.togglePalette(meta.get("type"),true)}>
					{meta.get("paletteOpened") && <Layer onClick={()=>this.togglePalette(meta.get("type"),false)}></Layer>}
					<ReactCSSTransitionGroup component="div" className="palette-wrapper" transitionName="radmenu-ani"
																	 transitionAppear={true} transitionAppearTimeout={800}
																	 transitionEnterTimeout={800} transitionLeaveTimeout={800}>
						{this.buildRadialPalette(feature, index)}
					</ReactCSSTransitionGroup>
				</Bag.PaletteTrigger>
		)
	},
	buildBagControl(props, state) {
		return props.width ? (
				<div ref="control" className="v-bag-control" style={{width: props.width}}>
					{
						state.bagData.map((feature, index)=> {
							var {meta}= feature.toObject();
							var className = cx({
								"v-palett-area": true,
								["-" + meta.get("type")]: true
							});
							return (
									<ReactCSSTransitionGroup component="div" className={className} key={meta.get("type")}
																					 transitionName="trigger-ani"
																					 transitionAppear={true} transitionAppearTimeout={500}
																					 transitionEnterTimeout={500} transitionLeaveTimeout={500}>
										{props.size && this.buildBagTriggerPoint(feature,index)}
									</ReactCSSTransitionGroup>
							)
						}).toArray()
					}
				</div>
		) : (
				<div ref="control" className="v-bag-control">
					Loading controls..
				</div>
		)
	},
	render() {
		return this.buildBagControl(this.props, this.state)
	}
});

//====================================================

Bag.SizeChooser = React.createClass({
	displayName: "Bag_SizeChooser",
	propTypes: {
		visible: React.PropTypes.bool,
		params: React.PropTypes.object
	},
	mixins: [Reactor.ReactMixin, ReactRouter.History],
	componentDidMount() {
		this.updateStoreBaseOnURL(this.props,this.state);
	},
	getDataBindings() {
		return {
			bagMeta: BagStore.getters.bagMeta,
			selectedBagOptions: BagStore.getters.selectedBagOptions
		}
	},
	hideSizeChooser(props, state) {
		this.history.pushState(null, `/bag/${state.selectedBagOptions.getIn(["size", "type"]) || "medium"}`, null);
	},
	updateStoreBaseOnURL(props,state) {
		BagStore.actions.selectSize(state.bagMeta.getIn(["size","list"]).find((value)=>value.get("type") == props.params.size));
	},
	sizeChangeConfirmation(size) {
		var isBagEdited = !this.state.selectedBagOptions.set("size",undefined).every(function (value,key) {
			return !value;
		});
		if (Immutable.is(this.state.selectedBagOptions.get("size"),size) || !isBagEdited) {
			this.selectSize(size,false);
		} else {
			BagStore.actions.setDialog({
				content: {
					message: "All selections will be clear. Do you want to continue?",
					accept: "OK",
					decline: "Cancel"
				},
				accept: ()=> {
					this.selectSize(size,true);
					BagStore.actions.setDialog(undefined);
				},
				decline: ()=> {
					BagStore.actions.setDialog(undefined);
				}
			})
		}
	},
	selectSize(size,shouldReset) {
		BagStore.actions.selectSize(size);
		shouldReset && BagStore.actions.resetBagOption();
		this.history.pushState(null, `/bag/${size.get("type")}`, null);
	},
	buildSlideToggler(props, state) {
		return props.visible ? (
				<div className="toggler" key="down">
					<div className="content" onClick={()=>this.hideSizeChooser(props,state)}>
						Down
					</div>
				</div>
		) : (
				<div className="toggler" key="up">
					<div className="content" onClick={()=>this.history.pushState(null, "/", null)}>
						Up
					</div>
				</div>
		)
	},
	buildSizeChooser(props, state) {
		var {meta,list} = state.bagMeta.get("size").toObject();
		var className = cx({
			"v-bag-size-chooser": true,
			"hidden": !props.visible
		});
		return (
				<ReactCSSTransitionGroup component="div" className={className} transitionName="bag-chooser-ani"
																 transitionAppear={true} transitionAppearTimeout={500}
																 transitionEnterTimeout={500} transitionLeaveTimeout={500}>
					<div className="wrapper">
						{this.buildSlideToggler(props, state)}
						<div className="title">Select a size</div>
						<ul className="list">
							{
								list.map((size, index)=> {
									var className = cx({
										"size": true,
										["size--" + size.get("type")]: true,
										"active": size.get("type") == state.selectedBagOptions.getIn(["size", "type"])
									});
									return (
											<li className={className} key={size.get("type")}>
												<div className="size-content" onClick={()=>this.sizeChangeConfirmation(size)}>
													<img src={size.get("img")} alt={size.get("title")}/>
													<h4 className="size-title">{size.get("title")}</h4>
												</div>
											</li>
									)
								}).toArray()
							}
						</ul>
					</div>
				</ReactCSSTransitionGroup>
		)
	},
	render() {
		return this.buildSizeChooser(this.props, this.state);
	}
});

//====================================================

Bag.SubmitButton = React.createClass({
	displayName: "SubmitButton",
	propTypes: {
		history: React.PropTypes.object,
		size: React.PropTypes.string
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		return {
			selectedBagOptions: BagStore.getters.selectedBagOptions
		}
	},
	toSubmitScreen(props,state) {
		this.props.history.pushState(null, `/bag/${props.size}/submit`, state.selectedBagOptions.map((value,key)=>{
			return value ? value.get("index") : value;
		}).toJS());
	},
	buildSubmitButton(props,state) {
		return (
				<div className="v-bag-submit">
					<Button title="FINISH" onClick={()=>this.toSubmitScreen(props,state)}></Button>
				</div>
		)
	},
	render() {
		return this.buildSubmitButton(this.props,this.state)
	}
});

module.exports = Bag;
