//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//===============================================
var Form= require("client/js/views/form");
var Button = require("client/js/components/button");

var Page = React.createClass({
	displayName: "DriverPostNewsPage",
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
			login: Store.getters.login,
			formDriverPostNews : Store.getters.formDriverPostNews
		}
	},
	getDefaultProps() {
		return {
			form: Immutable.fromJS({
				POST: "/api/drivers/driver/postnews",
				field: [
					{
						id: "title",
						type: "text",
						title: "Title",
						required: true,
						maxLength: 255,
						validation: [
							{
								type:"length",
								length: [1,255]
							}
						]
					},
					{
						id: "image",
						type: "file",
						title: "Image",
						accept: "image/*",
						placeholder: `Allowed file types: png | gif | jpg. Image size limit is 3MB. <br/>The image size is adapted with 740 x 500 (Width x Height).`,
						getValidation:(fieldProps,validation,isValid)=> {
							return mdx(validation.type,{
								"size": ()=> {
									return isValid ? null : {
										type: "error",
										message: "Image size exceeded limit"
									}
								}
							});
						},
						validation: [
							{
								type: "size",
								size: "3000000"
							}
						]
					},
					{
						id: "videoURL",
						title: "Video URL",
						type: "text",
						maxLength: 255,
						placeholder:"Youtube or DailyMotion URL",
						validation: [
							{
								type:"length",
								length: [1,255]
							}
						]
					},
					{
						id: "content",
						title: "Content",
						className: "ckeditor",
						required: true,
						maxLength: 255,
						type: "ckeditor",
						validation: [
							{
								type:"length",
								length: [1,Infinity]
							}
						]
					}
				]
			})
		}
	},
	componentWillMount() {
	},
	onSubmit(isValid,formData,postURL,alrt) {
		if (isValid) {
			Store.actions.postForm({
				target: "formDriverPostNews",
				URL: postURL,
				data: formData,
				onSuccess: ()=> {
					this.refs["form"].reset();
				}
			})
		} else {
			if (alrt) {
				Store.actions.alertStatus("formDriverPostNews",alrt.getIn(["image",0]));
			} else {
				Store.actions.alertStatus("formDriverPostNews",{
					type: "error",
					message: initData.alert.requiredField
				});
			}
		}
	},
	buildPage(props, state) {

		let _id = state.login.get("id");
		let _meta = state.formDriverPostNews.get("meta");
		let _alert = _meta.get("alert");

		var className = cx({
			"p-drivers-postnews": true
		});

		return (
			<div className={className}>
				<div className="v-block-title">
					<h2 className="title">
						Post a news
					</h2>
					<div className="description">
						{initData.text.driverPostNewsSubtitle1} <a href="/editorial-guide">Editorial Guidelines</a>
					</div>
				</div>
				{ (_alert &&_alert.get("type") === "info") ? (
					<Form>
						<div className="v-alert v-alert--info" dangerouslySetInnerHTML={{__html: _meta.getIn(["alert","message"])}}>
						</div>
						<div className="actions center">
							<Button className="btn load-more " URL="/drivers/postnews" title="Post another news"></Button>
						</div>
					</Form>
				) :
					<Form ref="form" alert={_meta.get("alert")} isLoading={_meta.get("isLoading")} device={props.device} form={props.form} onSubmit={this.onSubmit} id={_id}></Form>
				}
			</div>
		)
	},
	render() {
		return this.buildPage(this.props, this.state)
	}
});

module.exports = Page;
