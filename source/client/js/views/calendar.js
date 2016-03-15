//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//============================================
var Button = require("client/js/components/button");
var Loading = require("client/js/components/loading");
var LoadMore = require("./load-more");
var NoResult = require("client/js/views/no-result");

const Calendar = React.createClass({
	displayName: "Calendar",
	propTypes: {
		meta: React.PropTypes.object,
		list: React.PropTypes.object,
		showViewAll: React.PropTypes.bool
	},
	getDefaultProps() {
		return {
			showViewAll: true
		}
	},
	buildViewAll() {
		return <Button className="btn load-more" URL="/calendar" title="All Calendar"></Button>
	},
	buildCalendar(props, state) {
		return (
			<div className="v-calendar">
				<div className="calendar-group">
					{
						props.list.size ? props.list.map((event, index)=> {
							return (
								<div className="wrapper" key={event.get("id")}>
									<Calendar.Item {...event.toJS()} />
								</div>
							)
						}) : (
							!props.meta.get("isLoading") ? <NoResult /> : null
						)
					}
				</div>
				{
					!props.meta.get("isLoading") ?
						(
							<div className="actions">
								<LoadMore device={props.device}
													buildViewAll={props.meta.get("type") == "home" ? this.buildViewAll : undefined}
													target="calendar"/>
							</div>
						)
						:
						<Loading />
				}
			</div>
		);
	},
	render() {
		return this.buildCalendar(this.props, this.state);
	}
});

Calendar.Item = React.createClass({
	displayName: "Calendar.Item",
	propTypes: {
		name: React.PropTypes.string,
		photo: React.PropTypes.string,
		date: React.PropTypes.string,
		location: React.PropTypes.string,
		detailURL: React.PropTypes.string,
		country: React.PropTypes.string
	},
	buildItem(props, state) {
		return (
			<div className="v-calendar-item">
				<div className="logo" title={props.name}>
					<img src={props.photo} alt={props.name || "Logo"}/>
				</div>
				<div className="summary">
					<span className="date" title={props.date}>{props.date}</span>
					<div className="location" title={props.location}>{props.location}</div>
					<div className="country" title={props.country}>{props.country ? props.country : <span>&nbsp;</span> }</div>
				</div>
				<Button URL={props.detailURL} target="_blank" className={cx({"btn":true, "no-link": !props.detailURL})}
								title="More info"></Button>
			</div>
		)
	},
	render() {
		return this.buildItem(this.props, this.state);
	}
});

module.exports = Calendar;
