//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//===============================================
var Form = require("client/js/views/form");

var Page = React.createClass({
	displayName: "DriverLogin",
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
			login: Store.getters.login
		}
	},
	getDefaultProps() {
		return {
			form: Immutable.fromJS({
				POST: "/api/profile/user/login",
				field: [
					{
						id: "email",
						type: "text",
						title: "Email",
						required: true,
						validation: [
							{
								type: "length",
								length: [1, 255]
							},
							{
								type: "email"
							}
						]
					},
					{
						id: "password",
						type: "text",
						title: "Password",
						required: true,
						htmlType: "password",
						validation: [
							{
								type: "length",
								length: [6, 255]
							}
						]
					}
				]
			})
		}
	},
	componentDidMount() {
		//Store.actions.enableLoginPanel(false);
	},
	onSubmit(isValid, formData, postURL,alrt) {
		if (isValid) {
			Store.actions.login(formData);
		} else {
			if (alrt) {
				Store.actions.alertStatus("login", alrt.get("newPassword"));
			} else {
				let messageKey = (formData.email === '' || formData.password === '') ? 'requiredField' : 'invalidLoginField';

				Store.actions.alertStatus("login", {
					type: "error",
					message: initData.alert[messageKey]
				});
			}
		}
	},
	buildPage(props, state) {

		let _meta = state.login.get("meta");

		var className = cx({
			"p-drivers-login": true
		});

		return (
			<div className={className}>
				<div className="v-block-title">
					<h2 className="title">
						User Login
					</h2>
				</div>
				<Form ref="form" alert={_meta.get("alert")} isLoading={_meta.get("isLoading")}
							device={props.device} form={props.form} onSubmit={this.onSubmit} id={""}>
					<div className="forgot-pwd-link">
						<a href="/drivers/forgot-password">Forgot password ?</a>
					</div>
				</Form>


			</div>
		)
	},
	render() {
		return this.buildPage(this.props, this.state)
	}
});

module.exports = Page;
