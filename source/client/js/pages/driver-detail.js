//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");

//===============================================
var Drivers = require("client/js/views/drivers");
var News = require("client/js/views/news");
var FloatingNav = require("client/js/views/floating-nav");

var Page = React.createClass({
	displayName: "DriversDetailPage",
	propTypes: {
		device: React.PropTypes.string,
		children: React.PropTypes.node,
		route: React.PropTypes.object,
		history: React.PropTypes.object,
		params: React.PropTypes.object
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		//The order matter - the list need to be uptop , before the meta state
		return {
			currentDriver: Store.getters.currentDriver,
			news: Store.getters.news
		}
	},
	buildFloatingNav(props, state) {
		//console.log(props);
		let _list = Immutable.fromJS([
			{title: "Biography", URL: "#detail"},
			{title: "Statistics", URL: "#statistic"},
			{title: "News", URL: "#news"}
		]);
		return <FloatingNav list={_list}></FloatingNav>
	},
	componentDidMount() {
		//console.log(this.props);
		Store.actions.getDriverDetail({id: this.props.params.id});
		Store.actions.getNewsList({type: "", uid: this.props.params.id, role: ""});
	},
	buildPage(props, state) {

		var className = cx({
			"p-drivers-detail": true
		});

		let _driverName = state.currentDriver.getIn(["profile", "table", 1, 0]);

		return (
			<div className={className}>
				{this.buildFloatingNav(props, state)}
				<span className="anchor" id="detail"></span>
				<div className="v-block-title">
					<h2 className="title">
						Driver Detail
					</h2>
				</div>
				<Drivers.DriversDetail device={props.device} {...state.currentDriver.toObject()} />
				<span className="anchor" id="statistic"></span>
				<div className="v-block-title">
					<h2 className="title">
						Statistics
					</h2>
				</div>
				<Drivers.DriversStatistic device={props.device} {...state.currentDriver.toObject()} />
				<span className="anchor" id="news"></span>
				<div className="v-block-title">
					<h2 className="title">
						{`${_driverName ? _driverName : "Driver's"} news`}
					</h2>
					<p className="description">
						{initData.text.driversDetailNewsSubtitle}
					</p>
				</div>
				<News device={props.device} {...state.news.toObject()} showViewAll={false}/>
				{this.props.children && React.cloneElement(this.props.children, {
					device: this.state.device
				})}
			</div>
		)
	},
	render() {
		return this.buildPage(this.props, this.state)
	}
});

module.exports = Page;
