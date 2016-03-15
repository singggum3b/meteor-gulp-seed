//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//===============================================
var Form = require("client/js/views/form");

var Page = React.createClass({
	displayName: "DriverForgotPassword",
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
				POST: "/api/drivers/driver/forgot_password",
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
					}
				]
			})
		}
	},
	onSubmit(isValid, formData, postURL,alrt) {
		if (isValid) {
			Store.actions.forgotPassword(formData);
		} else {
			if (alrt) {
				Store.actions.alertStatus("login", alrt.get("email"));
			} else {
				let messageKey = (formData.email === '') ? 'requiredField' : 'invalidEmailField';

				Store.actions.alertStatus("login", {
					type: "error",
					message: initData.alert[messageKey]
				});
			}
		}
	},
	buildPage(props, state) {

		let _meta = state.login.get("meta");
		let _forgotEmailSent = _meta.get("forgotEmailSent");

		var className = cx({
			"p-drivers-forgotPWD": true
		});

		return (
			<div className={className}>
				<div className="v-block-title">
					<h2 className="title">
						Forgot Password
					</h2>
				</div>
				{_forgotEmailSent ? (
					<div className="v-alert v-alert--info">
						{_meta.getIn(["alert","message"])}
					</div>
				)
					:
					<Form ref="form" alert={_meta.get("alert")} isLoading={_meta.get("isLoading")}
							device={props.device} form={props.form} onSubmit={this.onSubmit} id={"forgotpwd"}></Form>}
			</div>
		)
	},
	render() {
		return this.buildPage(this.props, this.state)
	}
});

module.exports = Page;
