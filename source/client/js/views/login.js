//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//==================FLUX=========================
var Layer = require("client/js/components/layer");
var Button = require("client/js/components/button");
var Loading = require("client/js/components/loading");
var Field = require("client/js/components/field");
var Form = require("client/js/views/form");

var Login = React.createClass({
	displayName: "Login",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		onHide: React.PropTypes.func,
		stage: React.PropTypes.oneOf([0, 1, 2, 3]),
		onChangeStage: React.PropTypes.func,
		alert: React.PropTypes.object
	},
	getDefaultProps() {

		return {
			stage: 0,
			onChangeStage: ()=> {
			}
		}
	},
	getInitialState() {
		return {
			stage: -1
		}
	},
	componentDidMount() {
		this.toStage(0);
	},
	toStage(value) {
		mdx(value, {
			0: ()=> {
				return this.props.onChangeStage({title: "User login"});
			},
			1: ()=> {
				return this.props.onChangeStage({title: "Forgot Password"});
			}
		});

		Store.actions.alertStatus("login",undefined);

		this.setState({
			stage: value
		});

	},
	buildComponent(props, state) {

		let _alertClass = cx({
			"v-alert": true,
			["v-alert--" + (props.alert ? props.alert.get("type") : "default")]: !!props.alert
		});

		return (
			<div className="v-login">
				{props.alert && <div className={_alertClass} dangerouslySetInnerHTML={{__html: props.alert.get("message")}}></div>}
				{
					mdx(state.stage, {
						0: ()=> {
							return <Login.SignIn onForgotPassword={()=>this.toStage(1)}></Login.SignIn>
						},
						1: ()=> {
							return <Login.Forgot ></Login.Forgot>
						}
					})
				}
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state);

	}
});

Login.SignIn = React.createClass({
	displayName: "Login.SignIn",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		onForgotPassword: React.PropTypes.func
	},
	serialize(cb) {
		Form.serialize(["email","password"],this,cb);
	},
	submitByKey(e) {
		if (e.keyCode === 13) {
			this.login();
		}
	},
	login() {
		this.serialize((_data)=>{
			_data = _data.toJS();
			if (_data.email && _data.password) {
				Store.actions.login(_data);
			} else {
				Store.actions.alertStatus("login", {
					type: "error",
					message: initData.alert.requiredField
				});
			}
		});

	},
	toForgotPassword() {
		this.props.onForgotPassword();
	},
	buildComponent(props, state) {
		return (
			<div className="v-login-authen">
				<div className="email">
					<Field ref="email" required validation={Immutable.fromJS([{type: "length",length: [1,255]},{type:"email"}])} type="text"
								 onKeyUp={this.submitByKey} tabIndex="1"
								 id="email" placeholder="Email"></Field>
				</div>
				<div className="v-button-field password">
					<Field ref="password" required validation={Immutable.fromJS([{type: "length",length: [6,255]}])} type="text"
								 onKeyUp={this.submitByKey} tabIndex="2"
								 htmlType="password" id="password" placeholder="Password"></Field>
					<Button className="login" title="Login"
									tabIndex="3" onKeyUp={this.login}
									onClick={this.login}></Button>
				</div>
				<Button className="forgot-password" title="Forgot password" onClick={this.toForgotPassword}></Button>
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Login.Alert = React.createClass({
	displayName: "Login.Alert",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		children: React.PropTypes.node,
		icon: React.PropTypes.string
	},
	buildComponent(props, state) {

		return (
			<div className="v-login-alert">
				<div className="icon"></div>
				<div className="content">
					{this.props.children && React.cloneElement(this.props.children, {
						device: this.props.device
					})}
				</div>
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

Login.Forgot = React.createClass({
	displayName: "Login.Forgot",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		children: React.PropTypes.node
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		//The order matter - the list need to be uptop , before the meta state
		return {
			login: Store.getters.login
		}
	},
	serialize(cb) {
		Form.serialize(["email"],this,cb);
	},
	submitByKey(e) {
		if (e.keyCode === 13) {
			this.forgotPassword();
		}
	},
	forgotPassword() {
		this.serialize((_data)=>{
			_data = _data.toJS();
			if (_data.email && _data.email != "") {
				Store.actions.forgotPassword(_data);
			} else {
				Store.actions.alertStatus("login",{
					type: "error",
					message: initData.alert.requiredField
				});
			}
		});


	},
	buildComponent(props, state) {
		return state.login.getIn(["meta","alert","type"]) != "info" ? (
			<div className="v-login-forgot">
				<div className="icon"></div>
				<div className="content">
					<div className="v-button-field">
						<Field required ref="email" type="text"
									 onKeyUp={this.submitByKey} tabIndex="1"
									 id="email" placeholder="Email" validation={Immutable.fromJS([{type: "length",length: [1,255]},{type:"email"}])} ></Field>
						<Button className="send-password" title="Send"
										tabIndex="2" onKeyUp={this.submitByKey}
										onClick={this.forgotPassword}></Button>
					</div>
				</div>
			</div>
		) : null;
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});


module.exports = Login;
