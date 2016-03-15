//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//==================FLUX=========================
var Layer = require("client/js/components/layer");
var Button = require("client/js/components/button");
var Loading = require("client/js/components/loading");
var Filter = require("client/js/views/filter");

var Suggestion = React.createClass({
	displayName: "Suggestion",
	propTypes: {
		limit: React.PropTypes.number,
		list: React.PropTypes.object,
		onClickItem: React.PropTypes.func,
		visible: React.PropTypes.bool,
		buildItem: React.PropTypes.func,
		onHide: React.PropTypes.func
	},
	getDefaultProps() {
		//console.log(this);
		return {
			buildItem: (item, index)=> {
				return (
					<div>
						{item.get("title") || item.get("name")}
					</div>
				)
			},
			limit: Infinity
		}
	},
	getInitialState() {
		return {
			visible: true
		}
	},
	componentWillReceiveProps(nextProps) {
		if (!Immutable.is(this.props.list, nextProps.list)) {
			this.setState({
				visible: true
			});
		}
	},
	onHide() {
		this.setState({
			visible: false
		});
	},
	buildComponent(props, state) {
		let _list = props.list.filter((item, index)=> {
			return index < props.limit;
		});

		return (_list && _list.size && state.visible) ? (
			<div className="v-suggestion">
				<Layer onClick={props.onHide ? props.onHide : this.onHide} allowTouchMove={!props.preventDefault}></Layer>
				{_list.map((item, index)=> {
					return (
						<li className="item" key={index} onClick={()=>props.onClickItem(item,index)}>
							{props.buildItem(item, index)}
						</li>
					)
				})}
				{props.list.size > props.limit ? <div className="footer">
					{"There are more results"}
				</div> : null}
			</div>
		) : null
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Suggestion.Box = React.createClass({
	displayName: "Suggestion.Box",
	propTypes: {
		target: React.PropTypes.string,
		type: React.PropTypes.string,
		onClickItem: React.PropTypes.func,
		buildItem: React.PropTypes.func,
		onHide: React.PropTypes.func,
		limit: React.PropTypes.number,
		buildActionButton: React.PropTypes.func,
		placeholder: React.PropTypes.string
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		//The order matter - the list need to be uptop , before the meta state
		return {
			[this.props.target]: Store.getters[this.props.target]
		}
	},
	getDefaultProps() {
		return {
			limit: Infinity,
			placeholder: "Search",
			buildActionButton(props, state) {
				let _value = state[props.target].getIn(["meta", props.type + "Filter"]);
				return <Button className="btn btn--black" title="Search"
											 URL={`/search?query=${encodeURIComponent(_value ? _value.trim() : "")}`}></Button>
			},
			onClickItem(item, index) {
				window.location.href = `/drivers/${item.get("alias")}`;
			}
		};
	},
	submitByKey(e) {
		if (e.keyCode === 13) {
			location.href = `/search?query=${encodeURIComponent(e.target.value.trim())}`;
		}
	},
	getInitialState() {
		return {};
	},
	componentWillReceiveProps(nextProps) {
	},
	buildComponent(props, state) {
		let _list = state[props.target].get("list");
		let _meta = state[props.target].get("meta");

		return (
			<div className="v-suggestion-box">
				<div className="input-box">
					<Filter extra={{delay: 1000,ignoreNull: true, activeLength: 3}}
									action="suggestion"
									onKeyUp={this.submitByKey}
									controlType="text" suggestion
									placeholder={props.placeholder}
									target={props.target} type={props.type}/>
					{props.buildActionButton(props, state)}

					{_meta.get("isLoading") ? (
						<Loading></Loading>
					) : null}
				</div>
				{(_list && _list.size) ? <Suggestion limit={props.limit}
																						 list={_list}
																						 onClickItem={props.onClickItem} visible={!!_list.size}/> : null}
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

module.exports = Suggestion;
