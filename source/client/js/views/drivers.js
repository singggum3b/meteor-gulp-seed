//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//==================COmp=========================
var Carousel = require("client/js/components/carousel-loop");
var Table = require("client/js/components/table");
var Image = require("client/js/components/image");
var Button = require("client/js/components/button");
var Loading = require("client/js/components/loading");
var Accordion = require("client/js/components/accordion");
var LoadMore = require("./load-more");
var Filter = require("client/js/views/filter");
var NoResult = require("client/js/views/no-result");
var Suggestion = require("client/js/views/suggestion");
//===============================================

const Drivers = React.createClass({
	displayName: "Drivers",
	statics: {
		buildResultDriverItem(driver) {
			return (<Drivers.SearchResultCard {...driver.toJS()} ></Drivers.SearchResultCard>)
		},
		processDetailCellText(value) {
			if (!value || value == "") return "-";
			if (/^\(:image\):/.test(value)) {
				return <img src={value.replace("(:image):","")} alt={"Image"}/>;
			} else {
				return String(value).replace("(:goldcup)", `<span class="v-cup v-cup--gold"></span>`)
					.replace("(:silvercup)", `<span class="v-cup v-cup--silver"></span>`)
					.replace("(:coppercup)", `<span class="v-cup v-cup--copper"></span>`);
			}

		},
		buildDetailCell(value, index) {
			let _processedValue = Drivers.processDetailCellText(value);
			return React.isValidElement(_processedValue) ? (
				<td key={index}>
					{_processedValue}
				</td>
			) : (
				<td key={index}>
					<p dangerouslySetInnerHTML={{__html: Drivers.processDetailCellText(value)}}></p>
				</td>
			)
		},
		buildDetailHeader(value, index) {
			return (
				<th key={index}>
					<p>{value}</p>
				</th>
			)
		}
	},
	render() {
		return (
			<div>Drivers</div>
		)
	}
});

Drivers.CompareBiography = React.createClass({
	displayName: "Drivers.CompareBiography",
	propsTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		profile: React.PropTypes.object,
		meta: React.PropTypes.object
	},
	buildDriverBio(driver) {
		return (
			<div className="driver-card">
				<div className="name">{driver.get("name")}</div>
				<div className="photo">
					<img src={driver.get("photo")} alt={driver.get("name")}/>
					<Table buildHeader={Drivers.buildDetailHeader}
								 buildCell={Drivers.buildDetailCell}
								 className="info"
								 data={driver.get("table")}
								 orientation="vertical"/>
				</div>
				<Button className="btn btn-profile load-more btn--black" URL={driver.get("profileURL")}
								title="Go to profile"/>
			</div>
		)
	},

	buildComponent(props, state) {
		return !props.meta.get("isLoading") ? (
			props.profile ? (
				<div className="v-compare-bio">
					{this.buildDriverBio(props.profile.get(0))}
					{this.buildDriverBio(props.profile.get(1))}
				</div>
			) : <NoResult></NoResult>
		): <Loading></Loading>
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Drivers.CompareHighLight = React.createClass({
	displayName: "Drivers.CompareHighLight",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		highlight: React.PropTypes.object,
		meta: React.PropTypes.object
	},
	buildComponent(props, state) {
		return !props.meta.get("isLoading") ? (
			(props.highlight && props.highlight.size) ? (
				<div className="v-compare-highlight">
					<Table buildHeader={Drivers.buildDetailHeader}
								 buildCell={Drivers.buildDetailCell}
								 className="table-highlight"
								 centerHeader
								 data={props.highlight}
								 orientation="vertical"/>
				</div>
			) : <NoResult></NoResult>
		) : <Loading></Loading>
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Drivers.CompareStatistic = React.createClass({
	displayName: "Drivers.CompareStatistic",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		profile: React.PropTypes.object,
		statistic: React.PropTypes.object,
		meta: React.PropTypes.object
	},
	buildCompareEventItem(props, event) {
		return (
			<Drivers.CompareEventItem device={this.props.device} {...event.toObject()} />
		)
	},
	buildComponent(props, state) {
		return !props.meta.get("isLoading") ? (
			props.profile ? (
				<div className="v-compare-statistic">
					{
						(props.statistic && props.statistic.size) ? props.statistic.map((championshipData, index)=> {

							let _events;

							try {
								_events = championshipData.get("events").filter((event)=>!!event);
							} catch (e) {

							}

							return championshipData ? (
								<div className="statistic-item" key={championshipData.get("id") || "cps" + index}>
									<Table buildHeader={Drivers.buildDetailHeader}
												 buildCell={Drivers.buildDetailCell}
												 className="table-overview"
												 centerHeader
												 data={championshipData.get("overviewTable")}
												 orientation="vertical"/>
									{(_events && _events.size) ?<div className="table-title">Events</div> : null}
									{(_events && _events.size) ? <Drivers.EventList className="v-compare-event-list" list={_events}
																		 buildEventItem={this.buildCompareEventItem}/> : null}
								</div>
							) : null
						}) : <NoResult></NoResult>
					}
					<div className="actions">
						<div className="wrapper">
							<Button className="btn load-more btn--black" URL={props.profile.getIn([0,"profileURL"])}
											title="Go to profile"/>
						</div>
						<div className="wrapper">
							<Button className="btn load-more btn--black" URL={props.profile.getIn([1,"profileURL"])}
											title="Go to profile"/>
						</div>
					</div>
				</div>
			) : <NoResult></NoResult>
		) : <Loading></Loading>
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Drivers.CompareEventItem = React.createClass({
	displayName: "Drivers.CompareEventItem",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		name: React.PropTypes.string,
		timeline: React.PropTypes.string,
		summaryTable: React.PropTypes.object,
		resultTable: React.PropTypes.object,
		totalTable: React.PropTypes.object
	},
	buildTableResult(props, state) {
		return mdx(props.device, {
			"phone": ()=> {
				let _center = Math.floor(props.resultTable.size / 2);
				let _splitTableArray = Immutable.Range(0, _center).toList().map((index)=> {
					return Immutable.List([])
						.push(props.resultTable.get(0))
						.push(props.resultTable.get(index + 1))
						.push(props.resultTable.get(_center + index + 1))
				});

				return (
					<Carousel visibleItemCount={1}>
						{
							_splitTableArray.map((table, index)=> {
								return (
									<Carousel.Item key={index}>
										<Table buildHeader={Drivers.buildDetailHeader} buildCell={Drivers.buildDetailCell}
													 className="table-result"
													 centerHeader
													 data={table}
													 orientation="vertical"/>
									</Carousel.Item>
								);
							})
						}
					</Carousel>
				)
			}
		}, ()=> {
			return <Table buildHeader={Drivers.buildDetailHeader} buildCell={Drivers.buildDetailCell} className="table-result"
										centerHeader
										data={props.resultTable}
										orientation="vertical"/>
		})
	},
	buildComponent(props, state) {
		return (
			<div className="v-compare-event-item">
				<div className="event-row">
					<Table buildHeader={Drivers.buildDetailHeader}
								 buildCell={Drivers.buildDetailCell}
								 className="table-summary"
								 centerHeader
								 data={props.summaryTable}
								 orientation="vertical"/>
				</div>
				<div className="event-row">
					<Table buildHeader={Drivers.buildDetailHeader}
								 buildCell={Drivers.buildDetailCell}
								 className="table-total"
								 centerHeader
								 data={props.totalTable}
								 orientation="vertical"/>
				</div>
				<div className="event-row">
					{this.buildTableResult(props, state)}
				</div>
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

//==============================================================

//==============================================================

Drivers.Finder = React.createClass({
	displayName: "Drivers.Finder",
	propTypes: {
		sourceID: React.PropTypes.string
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		//The order matter - the list need to be uptop , before the meta state
		return {
			drivers: Store.getters.drivers,
			currentDriver: Store.getters.currentDriver
		}
	},
	componentDidMount() {
		Store.actions.loadingStatus("drivers", false);
	},
	onClickSuggestionItem(driver, index) {
		Store.actions.selectSuggestionDriver({id: driver.get("id") + "", name: driver.get("name")});
	},
	buildToggleButton() {
		return (
			<Button className="is-button-compare" title="Compare drivers"
							icon={require("client/img/profile-fb-icon.png")}></Button>
		)
	},
	buildSuggestion(props, state, list) {

		let _list = list.map((driver, index)=> {
			return driver.set("title", driver.get("name"));
		}).filter((driver, index)=> {
			return driver.get("id") != state.currentDriver.get("id");
		});

		return (
			<Suggestion limit={5}
									list={_list}
									onClickItem={this.onClickSuggestionItem} visible={!!_list.size}></Suggestion>
		)
	},
	goToComparePage(currentID, targetID) {
		window.location.href = `/drivers/compare?current=${currentID}&target=${targetID}`;
	},
	buildComponent(props, state) {
		let {meta,list} = state.drivers.toObject();
		let currentID = state.currentDriver.get("id");
		let compareID = state.currentDriver.getIn(["meta", "compareIDFilter"]);

		return (
			<Accordion className="v-drivers-finder">
				<Accordion.Item key="panel" title={this.buildToggleButton}>
					<div className="panel">
						<Filter extra={{compareID: compareID}} require={["nameFilter"]} controlType="customSelect"
										target="drivers" type="champion"/>
						<Filter extra={{compareID: compareID}} require={["nameFilter"]} controlType="customSelect"
										target="drivers" type="country"/>
						<div className="v-suggestion-box">
							<Filter extra={{compareID: compareID,delay: 3000,ignoreNull: true}} controlType="text" suggestion
											placeholder="Name"
											target="drivers" type="name"/>
							{list.size ? this.buildSuggestion(props, state, list) : null}
						</div>
						{meta.get("isLoading") ? (
							<Loading></Loading>
						) : <Button disable={!compareID} onClick={()=>this.goToComparePage(currentID,compareID)}
												className="btn compare" title="Compare"></Button>}
					</div>
				</Accordion.Item>
			</Accordion>
		);
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Drivers.Profile = React.createClass({
	displayName: "Drivers.Profile",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		photo: React.PropTypes.string,
		table: React.PropTypes.object,
		facebookURL: React.PropTypes.string,
		twitterURL: React.PropTypes.string,
		youtubeURL: React.PropTypes.string,
		hightlight: React.PropTypes.object
	},
	buildCustomRow(row, rowIndex, orientation) {

	},
	buildSocialLinks(props, state) {
		return (
			<div className="driver-profile-social">
				{props.facebookURL &&
				<Button mode="image" title="facebook" target="_blank" icon={require("client/img/profile-fb-icon.png")}
								URL={props.facebookURL}/>}
				{props.twitterURL &&
				<Button mode="image" title="twitter" target="_blank" icon={require("client/img/profile-tw-icon.png")}
								URL={props.twitterURL}/>}
				{props.youtubeURL &&
				<Button mode="image" title="youtube" target="_blank" icon={require("client/img/profile-youtube-icon.png")}
								URL={props.youtubeURL}/>}
			</div>
		)
	},
	buildComponent(props, state) {
		return (
			<div className="v-driver-profile">
				<div className="photo-wrapper">
					<div className="profile-photo">
						<img src={props.photo} alt={props.table.getIn([1,0])}/>
					</div>
					{props.device != "phone" && this.buildSocialLinks(props, state)}
				</div>
				<div className="profile-info-wrapper">
					<Table buildHeader={Drivers.buildDetailHeader} buildCell={Drivers.buildDetailCell}
								 className="tablet-profile" data={props.table}
								 orientation="vertical"/>
				</div>
				{props.device == "phone" && this.buildSocialLinks(props, state)}
				{props.highlight ?
					<Drivers.Highlight device={props.device} {...props.highlight.toObject()} />
					:
					(<Drivers.Highlight device={props.device}/>)
				}
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Drivers.Highlight = React.createClass({
	displayName: "Drivers.Highlight",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		table: React.PropTypes.object,
		title: React.PropTypes.string
	},
	buildComponent(props, state) {

		return props.table ? (
			<div className="v-driver-highlight">
				{props.device != "phone" && <Drivers.Finder />}
				<div className="tilte">
					{props.title}
				</div>
				<Table buildHeader={Drivers.buildDetailHeader} buildCell={Drivers.buildDetailCell} className="table-highlight"
							 orientation="vertical" data={props.table}/>
				{props.device == "phone" && <Drivers.Finder />}
			</div>
		) : (
			<div className="v-driver-highlight">
				<Drivers.Finder />
			</div>
		);
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Drivers.ChampionshipOverview = React.createClass({
	displayName: "Drivers.ChampionshipOverview",
	propTypes: {
		table: React.PropTypes.object,
		logo: React.PropTypes.string,
		name: React.PropTypes.string
	},
	buildComponent(props, state) {
		return (
			<div className="v-championship-overview">
				<div className="logo">
					<img src={props.logo} alt={props.name}/>
				</div>
				<Table buildHeader={Drivers.buildDetailHeader} buildCell={Drivers.buildDetailCell} className="table-overview"
							 orientation="vertical" layout={[4,4,Infinity]} data={props.table}/>
			</div>
		);
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Drivers.EventList = React.createClass({
	displayName: "Drivers.EventList",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		list: React.PropTypes.object,
		buildEventItem: React.PropTypes.func,
		className: React.PropTypes.string
	},
	getDefaultProps() {
		return {
			buildEventItem: (props, event)=> {
				return (
					<Drivers.EventItem device={props.device} {...event.toObject()} />
				)
			}
		}
	},
	buildEventTitle (timeline, title) {
		return (
			<div>{timeline} - <strong>{title}</strong></div>
		);
	},
	buildComponent(props, state) {
		let _className = cx({
			"v-drivers-event-list": !props.className,
			[props.className]: !!props.className
		});

		return props.list ? (
			<Accordion className={_className}>
				{
					props.list.map((event, index)=> {
						return event ? (
							<Accordion.Item key={event.get("id")}
															title={()=>this.buildEventTitle(event.get("timeline"), event.get("name"))}>
								{props.buildEventItem(props, event)}
							</Accordion.Item>
						) : null
					})
				}
			</Accordion>
		) : null
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Drivers.EventItem = React.createClass({
	displayName: "Drivers.EventItem",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		name: React.PropTypes.string,
		timeline: React.PropTypes.string,
		summaryTable: React.PropTypes.object,
		resultTable: React.PropTypes.object,
		totalTable: React.PropTypes.object
	},
	buildComponent(props, state) {
		return (
			<div className="v-drivers-event-item">
				<div className="event-row is-backgroud-gray">
					<div className="event-col is-first-event-col">

						&nbsp;
					</div>
					<div className="event-col-large  is-backgroud-white">
						<Table buildHeader={Drivers.buildDetailHeader} buildCell={Drivers.buildDetailCell}
									 className="table-summary" layout={[2,2]} orientation="vertical" data={props.summaryTable}/>
					</div>
				</div>
				<div className="event-row  is-backgroud-gray">
					<div className="event-col">
						<Table buildHeader={Drivers.buildDetailHeader} buildCell={Drivers.buildDetailCell} className="table-total"
									 orientation="vertical" data={props.totalTable}/>
					</div>
					<div className="event-col-large  is-backgroud-white">
						{
							props.device == "phone" ?
								<Table buildHeader={Drivers.buildDetailHeader} buildCell={Drivers.buildDetailCell}
											 className="table-result" orientation="vertical" limitRowView={1} data={props.resultTable}/>
								:
								<Table buildHeader={Drivers.buildDetailHeader} buildCell={Drivers.buildDetailCell}
											 className="table-result" orientation="vertical" data={props.resultTable}/>
						}
					</div>
				</div>
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Drivers.DriversDetail = React.createClass({
	displayName: "Drivers.DriversDetail",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		profile: React.PropTypes.object,
		highlight: React.PropTypes.object,
		meta: React.PropTypes.object
	},
	buildComponent(props, state) {
		return !props.meta.get("isLoading") ? (
			(props.profile ? <div className="v-driver-detail">
				<Drivers.Profile device={props.device} {...props.profile.toObject()} highlight={props.highlight}/>
			</div> : null)
		) : <Loading></Loading>

	},
	render() {

		return this.buildComponent(this.props, this.state);
	}
});

Drivers.DriversStatistic = React.createClass({
	displayName: "Drivers.DriversStatistic",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		statistic: React.PropTypes.object,
		meta: React.PropTypes.object
	},
	buildComponent(props, state) {

		return !props.meta.get("isLoading") ? (
			<div className="v-driver-statistic">
				{
					props.statistic ? props.statistic.map((championshipData, index)=> {
						return (
							<div key={championshipData.get("id")} className="v-championship-statistic">
								<div className="title is-title-driver-detail">
									{championshipData.get("name")}
								</div>
								<Drivers.ChampionshipOverview name={championshipData.get("name")}
																							logo={championshipData.get("logo")}
																							table={championshipData.get("overviewTable")}/>
								<div className="table-title">
									Events
								</div>
								<Drivers.EventList device={props.device} list={championshipData.get("events")}/>
							</div>
						);
					}) : <NoResult></NoResult>
				}
			</div>
		) : <Loading></Loading>
	},
	render() {
		return this.buildComponent(this.props, this.state)
	}
});

Drivers.PreviewCard = React.createClass({
	displayName: "Drivers.PreviewCard",
	propTypes: {
		name: React.PropTypes.string,
		team: React.PropTypes.string,
		URL: React.PropTypes.string,
		photo: React.PropTypes.string,
		isNew: React.PropTypes.bool,
		country: React.PropTypes.shape({
			name: React.PropTypes.string.isRequired,
			flagImage: React.PropTypes.string.isRequired
		})
	},
	buildCard(props, state) {
		let _className = cx({
			"v-drivers-previewcard": true,
			"is-new": props.isNew
		});

		return (
			<div className={_className}>
				<a className="url" href={props.URL}>
					<div className="photo">
						<img src={props.photo} alt={`${props.name}_${props.team}`} />
						{props.isNew && <div className="isnew-board"></div>}
					</div>
					{props.countryFlagImage && <img src={props.countryFlagImage} alt={"Flag"}
																					className="flag-image"/>}
					<div className="name">
						<div>{props.name}</div>
					</div>
					<div className="team">
						<div>{props.team}</div>
					</div>
				</a>
			</div>
		)
	},
	render() {
		return this.buildCard(this.props, this.state);
	}
});

Drivers.SearchResultCard = React.createClass({
	displayName: "Drivers.SearchResultCard",
	propTypes: {
		name: React.PropTypes.string,
		team: React.PropTypes.string,
		URL: React.PropTypes.string,
		photo: React.PropTypes.string,
		isNew: React.PropTypes.bool,
		biography: React.PropTypes.string,
		country: React.PropTypes.shape({
			name: React.PropTypes.string.isRequired,
			flagImage: React.PropTypes.string.isRequired
		})
	},
	buildCard(props, state) {
		let _className = cx({
			"v-drivers-srcard": true,
			"is-new": props.isNew
		});

		return (
			<div className={_className}>
				<a className="url" href={props.URL}>
					<div className="photo">
						<img src={props.photo} alt={`${props.name}_${props.team}`} />
						{props.isNew && <div className="isnew-board"></div>}
					</div>
					<div className="info">
						<div className="name">{props.name}</div>
						<div className="biography">{props.biography}</div>
					</div>
				</a>
			</div>
		)
	},
	render() {
		return this.buildCard(this.props, this.state);
	}
});

Drivers.List = React.createClass({
	displayName: "Drivers.List",
	propTypes: {
		meta: React.PropTypes.object,
		list: React.PropTypes.object,
		device: React.PropTypes.oneOf(DEVICE),
		showViewAll: React.PropTypes.bool,
		showFilter: React.PropTypes.bool,
		buildItem: React.PropTypes.func
	},
	getDefaultProps() {
		return {
			showViewAll: true,
			showFilter: true,
			buildItem(driver) {
				return <Drivers.PreviewCard {...driver.toJS()} />;
			}
		}
	},
	getInitialState() {
		return {
			showFilterPhone: false
		}
	},
	toggleFilterState() {
		this.setState({
			showFilterPhone: !this.state.showFilterPhone
		})
	},
	buildFilterToggleButton(props, state) {
		return (
			<Button className="btn load-more btn--black" title={props.active ? "Hide Filter" : "Filter"}/>
		)
	},
	buildFilter(props, state) {
		return props.showFilter ? mdx(props.device, {
			"phone": ()=> {
				return (
					<Accordion className="filters">
						<Accordion.Item active={state.showFilterPhone} onClick={this.toggleFilterState} key="panel"
														title={this.buildFilterToggleButton}>
							<Filter extra={{delay: 3000}} controlType="text" placeholder="Name" target="drivers" type="name"/>
							<Filter controlType="customSelect" target="drivers" type="champion"/>
							<Filter controlType="customSelect" target="drivers" type="country"/>
						</Accordion.Item>
					</Accordion>
				)
			}
		}, ()=> {
			return (
				<div className="filters">
					<Filter extra={{delay: 3000}} controlType="text" placeholder="Name" target="drivers" type="name"/>
					<Filter controlType="customSelect" target="drivers" type="champion"/>
					<Filter controlType="customSelect" target="drivers" type="country"/>
					{props.device != DEVICE[0] && <Filter controlType="alphabet" target="drivers" type="letter"/>}
				</div>
			)
		}) : null
	},
	buildComponent(props, state) {
		return (
			<div className="v-drivers-list">
				{this.buildFilter(props, state)}
				<div className="list">
					{
						(props.list && props.list.size) ? props.list.map((driver, index)=> {
							return (
								<div className="wrapper" key={driver.get("id")}>
									{props.buildItem(driver)}
								</div>
							)
						}) : (
							(!props.meta.get("isLoading") && props.meta.get("everLoaded")) ? <NoResult /> : null
						)
					}
				</div>
				{!props.meta.get("isLoading") ?
					(
						<div className="actions">
							<LoadMore buildViewAll={props.showViewAll ? undefinded : ()=>null} device={props.device}
												target="drivers"/>
						</div>
					)
					:
					(
						<Loading></Loading>
					)}
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Drivers.Carousel = React.createClass({
	displayName: "Drivers.Slider",
	propTypes: {
		meta: React.PropTypes.object,
		list: React.PropTypes.object,
		device: React.PropTypes.oneOf(DEVICE)
	},
	componentDidUpdate() {
		this._carouselDOM && this._carouselDOM.height(this._carouselDOM.find(".item").height());
	},
	carouselRefs(carousel) {
		this._carouselDOM = $(ReactDOM.findDOMNode(carousel));
		this._carouselDOM.height(this._carouselDOM.find(".item").height());
	},
	buildCarousel(props, state) {

		return !props.meta.get("isLoading") ? (
			(props.list && props.list.size) ? (
				<div className="v-drivers-carousel">
					<Carousel ref={this.carouselRefs}
										visibleItemCount={props.device == DEVICE[0] ? 2 : props.device == DEVICE[1] ? 3 : 6}>
						{
							props.list.map((driver, index)=> {
								return (
									<Carousel.Item key={driver.get("id")}>
										<Drivers.PreviewCard {...driver.toJS()} />
									</Carousel.Item>
								)
							})
						}
					</Carousel>
					<div className="actions">
						<Button URL="/drivers" className="btn load-more" title="See all Drivers"></Button>
					</div>
				</div>
			) : (
				(!props.meta.get("isLoading") && props.meta.get("everLoaded")) ? <NoResult /> : null
			)
		) : <Loading></Loading>
	},
	render() {
		return this.buildCarousel(this.props, this.state);
	}
});

module.exports = Drivers;
