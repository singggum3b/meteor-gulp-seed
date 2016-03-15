//==================FLUX=========================
var Reactor = require("js/reactor.js");
var BagStore = require("js/bag-store");

//================================================
var Button = require("js/components/button");
var Field = require("js/components/field");

const SubmitPage= React.createClass({
	displayName: "SubmitPage",
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		return {
			bagMeta: BagStore.getters.bagMeta,
			bagData: BagStore.getters.bagData,
			customerComment: BagStore.getters.customerComment,
			customerName: BagStore.getters.customerName
		}
	},
	isFormValidated(state) {
		return state.customerName.trim().length;
	},
	updateCustomerName(id,value) {
		BagStore.actions.updateCustomerName(value);
	},
	updateCustomerComment(id,value) {
		BagStore.actions.updateCustomerComment(value);
	},
	buildEmailBody(props,state) {
		return state.bagData.set("size",state.bagMeta.get("size")).map((feature,index)=>{
			var {meta,list} = feature.toObject();
			return `• ${meta.get("title")} : ${list.getIn([props.location.query[meta.get("type")],"title"]) || "Default"}`;
		}).join("\n\r%0D%0A\n\r%0D%0A")
				.concat(`\n\r%0D%0A\n\r%0D%0ACustomer Name: ${encodeURIComponent(state.customerName)}`)
				.concat(`\n\r%0D%0A\n\r%0D%0AComment: ${encodeURIComponent(state.customerComment)}`);
	},
	buildBagDetail(props,state) {
		return (
				<ul>
					{
							state.bagData.set("size",state.bagMeta.get("size")).map((feature,index)=>{
								var {meta,list} = feature.toObject();
								return (
										<li key={meta.get("type")}>
											<span>{meta.get("title") + " : "}</span>
											<span>{list.getIn([props.location.query[meta.get("type")],"title"]) || "Default"}</span>
										</li>
								)
							}).toArray()
					}
				</ul>
		)
	},
	buildSubmitPage(props,state) {
		var email = (process.env.NODE_ENV == "production") ? "DRANDALL@coach.com,BMORRISON@coach.com" : "phuongdt@pycogroup.com,hung.pham@pycogroup.com";
		var className=cx({
			"v-submit-form" : true,
			validated: this.isFormValidated(state)
		});
		return (
				<div className="v-submit-page animated fadeIn">
					<div className={className}>
						<h3 className="title">
							SUMMARY
						</h3>
						<hr/>
						<div className="bag-detail">
							{this.buildBagDetail(props,state)}
						</div>
						<div className="customer-name">
							<Field required id="customerName" type="text" maxLength="100" placeholder="CUSTOMER NAME" onChange={this.updateCustomerName} value={state.customerName}></Field>
						</div>
						<div className="comment">
							<Field id="comment" type="textarea" maxLength="300" placeholder="COMMENT" onChange={this.updateCustomerComment} value={state.customerComment}></Field>
						</div>
						<div className="action">
							<Button className="back" title="CLOSE" onClick={()=>this.props.history.goBack()}></Button>
							<Button className="mailto" URL={`mailto:${email}?subject=VIP Swagger Order&body=${this.buildEmailBody(props,state)}`} title="Email bag details"></Button>
						</div>
					</div>
				</div>
		)
	},
	render() {
		return this.buildSubmitPage(this.props,this.state);
	}
});

module.exports = SubmitPage;
