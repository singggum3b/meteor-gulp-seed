//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//================================================
var Button = require("client/js/components/button");
var MiniPanel = require("client/js/views/mini-panel");
var Suggestion = require("client/js/views/suggestion");
var Login = require("client/js/views/login");


var Header = React.createClass({
	displayName: "Header",
	mixins: [Reactor.ReactMixin],
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE).isRequired,
		location: React.PropTypes.object,
		route: React.PropTypes.object
	},
	getDataBindings() {
		return {
			siteRoutes: Store.getters.siteRoutes,
			login: Store.getters.login
		}
	},
	getInitialState() {
		return {
			isSearchPanelVisible: false,
			isLoginPanelVisible: false,
			loginPanelTitle: "User paddock"
		}
	},
	buildSiteRoute(props, state) {
		return state.siteRoutes.map((route, index)=> {
			let {name,URL,UIGroup} = route.toObject();
			//console.log(location.pathname,URL);
			let _className = cx({
				"item": true,
				"active": URL == "/" ? (location.pathname == URL) : (location.pathname == URL || location.pathname.indexOf(URL) == 0)
			});

			return UIGroup.includes("main-textmenu") ? (
				<a key={name} href={URL} className={_className}>{name}</a>
			) : null
		});
	},
	buildSearchPanel(props, state) {
		return (
			<MiniPanel onHide={()=>this.toggleSearchPanel(false)} visible={state.isSearchPanelVisible}>
				<Suggestion.Box placeholder="Enter Keyword" target={"suggestionDrivers"} type={"name"} limit={5}/>
			</MiniPanel>
		)
	},
	buildLoginPanel(props, state) {
		return state.login.get("id") ? null
			: (
			<MiniPanel onHide={()=>this.toggleLoginPanel(false)} visible={state.isLoginPanelVisible}
								 title={state.loginPanelTitle}>
				<Login alert={state.login && state.login.getIn(["meta","alert"])}
							 onChangeStage={({title=undefined})=>this.setState({loginPanelTitle : title})}></Login>
			</MiniPanel>
		)
	},
	buildSearchToggleButton(props, state) {
		return (
			<Button className="search"
							onClick={()=>this.toggleSearchPanel(!state.isSearchPanelVisible)}
							title="Search" mode="image" icon={require("client/img/search_icon.png")}/>
		)
	},
	buildAuthenticatedButton(props,state) {
		let _list= Immutable.fromJS([
			{
				title: "Profile",
				onClick:()=>{
					window.location.href = `/drivers/${state.login.get("alias")}`
				}
			},
			{
				title: "Edit Profile",
				onClick:()=>{
					window.location.href = `/user/${state.login.get("id")}/edit`
				}
			},
			{
				title: "Post a news",
				onClick:()=>{
					window.location.href = `/drivers/postnews`
				}
			},
			{
				title: "Disconnect",
				onClick:()=>{
					window.location.href = "/user/logout";
				}
			}
		]);
		return (
			<Button className="account authenticated"
							active={false}
							list={_list}
							onClick={()=>{}}
							title="Login" mode="image" icon={state.login.get("photo")}/>
		)
	},
	buildLoginButton(props, state) {
		return state.login.get("id") ?
			this.buildAuthenticatedButton(props,state)
			:
			<Button className="account"
							URL={(initData.loginURL || "/") + "drivers/login"}
							title="Login" mode="image" icon={require("client/img/user_icon.png")}/>
	},
	toggleSearchPanel(visible) {
		if (!visible) {
			Store.actions.resetSuggestion("suggestionDrivers");
		}
		this.setState({isSearchPanelVisible: visible})
	},
	toggleLoginPanel(visible) {
		this.setState({isLoginPanelVisible: visible});
		Store.actions.alertStatus("login", undefined);
	},
	buildHeader(props, state) {

		return mdx(props.device, {
			"phone": ()=> {
				let menuList = state.siteRoutes.map((route, index)=> {
					let {name,URL,UIGroup} = route.toJS();
					return UIGroup.includes("main-textmenu") ? Immutable.fromJS({
						title: name,
						mode: "text",
						URL: URL,
						active: location.pathname == URL
					}) : undefined
				}).filter((val)=>!!val);
				return (
					<ReactCSSTransitionGroup component="div" className="v-header" transitionName="trigger-ani"
																	 transitionAppear={true} transitionAppearTimeout={1000}
																	 transitionEnterTimeout={500} transitionLeaveTimeout={500}>
						<div className="menu">
							<div className="logo-img">
								<a href="/" className="f4logo"></a>
								<a href="http://www.fia.com" target="_blank" className="fialogo"></a>
							</div>
							{this.buildLoginButton(props, state)}
							{this.buildSearchToggleButton(props, state)}
							<Button className="menubread" title="menubread" mode="image" list={menuList}
											icon={require("client/img/menu_icon.png")}/>
							{this.buildSearchPanel(props, state)}
							{this.buildLoginPanel(props, state)}
						</div>
					</ReactCSSTransitionGroup>
				)
			}
		}, ()=> {
			let _siteRoute = this.buildSiteRoute(props, state);
			return (
				<ReactCSSTransitionGroup component="div" className="v-header" transitionName="trigger-ani"
																 transitionAppear={true} transitionAppearTimeout={1000}
																 transitionEnterTimeout={500} transitionLeaveTimeout={500}>
					<div className="header-inner">
						<div className="logo-img">
							<a href="/" className="f4logo">F4 logo</a>
							<a href="http://www.fia.com" target="_blank" className="fialogo">Fia logo</a>
						</div>
						<div className="menu">
							<div className="text-menu">
								{_siteRoute}
							</div>
							{this.buildLoginButton(props, state)}
							{this.buildSearchToggleButton(props, state)}
						</div>
						{this.buildSearchPanel(props, state)}
						{this.buildLoginPanel(props, state)}
					</div>
				</ReactCSSTransitionGroup>
			)
		});
	},
	render() {
		return this.buildHeader(this.props, this.state);
	}
});

module.exports = Header;
