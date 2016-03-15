//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//===============================================
var Calendar = require("client/js/views/calendar");

var Page = React.createClass({
	displayName: "Calendar",
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
			calendar: Store.getters.calendar
		}
	},
	componentWillMount() {
		Store.actions.getCalendarList({type: "", pagesize: 12});
	},
	buildPage(props, state) {

		var className = cx({
			"p-calendar": true
		});

		return (
			<div className={className}>
				<div className="v-block-title">
					<h2 className="title">
						Calendar 2016
					</h2>
					<p className="description">
						{initData.text.calendarSubtitle1}
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
		return this.buildPage(this.props, this.state)
	}
});

module.exports = Page;
