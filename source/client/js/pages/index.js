//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//===============================================
var Drivers = require("client/js/views/drivers");
var Calendar = require("client/js/views/calendar");
var News = require("client/js/views/news");

var IndexPage = React.createClass({
	displayName: "IndexPage",
	propTypes: {
		device: React.PropTypes.string,
		children: React.PropTypes.node,
		route: React.PropTypes.object,
		history: React.PropTypes.object
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		//The order matter - the list need to be uptop , before the meta state
		return {
			drivers: Store.getters.drivers,
			calendar: Store.getters.calendar,
			news: Store.getters.news
		}
	},
	componentDidMount() {
		Store.actions.getNewsList({type: "", role: "home"});
		Store.actions.getDriversList({type: "home"});
		Store.actions.getCalendarList({type: "home"});
	},
	buildIndexPage(props, state) {

		var className = cx({
			"p-index": true
		});

		//console.log(state.drivers.toJS());

		return (
			<div className={className}>
				<div className="v-block-title welcome">
					<h2 className="title">
						Welcome to the <br/>
						<strong>Formula 4 drivers club</strong>
					</h2>
					<p className="description">
						{initData.text.homeSubtitle1}
					</p>
				</div>
				<Drivers.Carousel device={props.device} {...state.drivers.toObject()} />
				<div className="v-block-title">
					<h2 className="title">
						Latest News
					</h2>
					<p className="description">
						{initData.text.homeSubtitle2}
					</p>
				</div>
				<News device={props.device} {...state.news.toObject()} />
				<div className="v-block-title">
					<h2 className="title">
						Calendar 2016
					</h2>
					<p className="description">
						{initData.text.homeSubtitle3}
					</p>
				</div>
				<Calendar device={props.device} {...state.calendar.toObject()} />
				{this.props.children && React.cloneElement(this.props.children, {
					device: this.state.device
				})}
			</div>
		)
	},
	render() {
		return this.buildIndexPage(this.props, this.state)
	}
});

module.exports = IndexPage;
