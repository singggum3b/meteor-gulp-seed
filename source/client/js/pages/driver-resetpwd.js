//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//===============================================
var Form = require("client/js/views/form");

var Page = React.createClass({
	displayName: "DriverRecoverPassword",
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
			formResetPWD: Store.getters.formResetPWD
		}
	},
	getDefaultProps() {
		return {
			form: Immutable.fromJS({
				POST: "/api/drivers/driver/reset_password",
				field: [
					{
						id: "newPassword",
						type: "mirrorfield",
						subType: "text",
						title: ["New Password", "Confirm new Password"],
						required: true,
						htmlType: "password",
						getValidation:(fieldProps,validation,isValid)=> {
							console.log(fieldProps, validation, isValid);
							return mdx(validation.type,{
								"mirrormatch": ()=> {
									return isValid ? null : {
										type: "error",
										message: "The confirm password does not match with the password"
									}
								}
							});
						}
					}
				]
			})
		}
	},
	onSubmit(isValid, formData, postURL,alrt) {
		if (isValid) {
			Store.actions.postForm({
				target: "formResetPWD",
				URL: postURL,
				data: formData,
				onSuccess: ()=> {
					window.location.href = "/";
				}
			});
		} else {
			if (alrt) {
				Store.actions.alertStatus("formResetPWD", alrt.get("newPassword"));
			} else {
				let messageKey = (formData.newPassword === '') ? 'requiredField' : 'invalidPasswordField';

				Store.actions.alertStatus("formResetPWD", {
					type: "error",
					message: initData.alert[messageKey]
				});
			}
		}
	},
	buildPage(props, state) {

		let _id = props.params.token;
		let _meta = state.formResetPWD.get("meta");

		var className = cx({
			"p-drivers-resetPWD": true
		});

		return (
			<div className={className}>
				<div className="v-block-title">
					<h2 className="title">
						Reset Password
					</h2>
				</div>
				<Form ref="form" alert={_meta.get("alert")} isLoading={_meta.get("isLoading")}
							device={props.device} form={props.form} onSubmit={this.onSubmit} id={_id}></Form>
			</div>
		)
	},
	render() {
		return this.buildPage(this.props, this.state)
	}
});

module.exports = Page;
