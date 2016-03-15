//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//===========================================
var Button = require("client/js/components/button");
var Field = require("client/js/components/field");

var Filter = React.createClass({
	displayName: "Filter",
	propTypes: {
		target: React.PropTypes.oneOf(["news", "drivers", "calendar", "suggestionDrivers"]).isRequired,
		title: React.PropTypes.string,
		type: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		controlType: React.PropTypes.oneOf(["select", "text", "customSelect", "alphabet"]),
		disable: React.PropTypes.bool,
		lazy: React.PropTypes.bool,
		require: React.PropTypes.array,
		onKeyUp: React.PropTypes.func,
		extra: React.PropTypes.object
	},
	getDefaultProps() {
		return {
			controlType: "select",
			action: "filter"
		}
	},
	getInitialState() {
		return {
			isExpanded: false
		}
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		return {
			[this.props.target]: Store.getters[this.props.target]
		}
	},
	onKeyUp(e) {
		this.props.onKeyUp && this.props.onKeyUp(e);
	},
	filter(id, activeValue, formattedVal, isValidated) {
		this.setState({
			isExpanded: false
		});

		(activeValue != this.state[this.props.target].getIn(["meta", this.props.type + "Filter"]))
		&& Store.actions[this.props.action](this.props.target, this.props.type, activeValue, this.state[this.props.target].get("meta").toJS(), this.props.lazy, this.props.require, this.props.extra);
	},
	toggleFilter(isOpen) {
		this.setState({
			isExpanded: !this.state.isExpanded
		});
	},
	buildComponent(props, state) {

		//console.log(state[props.target].get("meta").toJS());
		return mdx(props.controlType, {
			"alphabet": ()=> {
				let alphabet = Immutable.fromJS("abcdefghijklmnopqrstuvwxyz".split(""))
					.map((char)=>Immutable.fromJS({title: char, value: char}))
					.unshift(Immutable.fromJS({title: "All", value: ""}));
				return (
					<div className="v-filter v-filter--alphabet">
						{
							alphabet.map((filter, index)=> {
								let _className = cx({
									"item": true,
									"active": state[props.target].getIn(["meta", props.type + "Filter"]) == filter.get("value")
								});
								return <span key={filter.get("title")} className={_className}
														 onClick={()=>this.filter(null,filter.get("value"))}>{filter.get("title")}</span>
							})
						}
					</div>
				)
			},
			"select": ()=> {
				return (
					<Field className="v-filter" id={`${props.target}_${props.type}`}
								 onChange={this.filter}
								 type="select" value={state[props.target].getIn(["meta","filter",props.type])}
								 defaultValue={state[props.target].getIn(["meta",props.type + "Filter"])}></Field>
				)
			},
			"text": ()=> {
				return (
					<Field className="v-filter" id={`${props.target}_${props.type}`}
								 placeholder={props.placeholder}
								 onChange={this.filter} onKeyUp={props.onKeyUp}
								 type="text" value={state[props.target].getIn(["meta",props.type + "Filter"])}
								 defaultValue={state[props.target].getIn(["meta",props.type + "Filter"])}></Field>
				)
			},
			"customSelect": ()=> {
				let _list, _activeValue, _activeTitle;
				try {
					_list = state[props.target].getIn(["meta", "filter", props.type]).map((item, index)=> {
						return Immutable.fromJS({
							title: item.get("title"),
							onClick: ()=> {
								this.filter(null, item.get("value"));
								this.setState({
									isExpanded: false
								});
							}
						});
					});
					_activeValue = state[props.target].getIn(["meta", props.type + "Filter"]);
					_activeTitle = state[props.target].getIn(["meta", "filter", props.type]).find((filter)=>filter.get("value") == _activeValue);
					_activeTitle = _activeTitle ? _activeTitle.get("title") : "No value selected";
					//console.log(state[props.target].getIn(["meta"]).toJS());
				} catch (e) {
					console.warn(`Failed to generate [${props.target + props.type}] filter data`);
				}

				return _list ? (
					<Button className="v-filter b-dropdown" mode="text"
									disable={props.disable}
									preventDefault={false}
									title={_activeTitle}
									active={state.isExpanded}
									showList={true}
									onClick={this.toggleFilter} list={_list}/>
				) : null;
			}
		});
	},
	render() {
		return this.buildComponent(this.props, this.state)
	}
});

module.exports = Filter;
