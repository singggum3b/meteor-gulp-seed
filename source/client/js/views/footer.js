//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");

var Footer = React.createClass({
	displayName: "Footer",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		location: React.PropTypes.object
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		return {
			siteRoutes: Store.getters.siteRoutes
		}
	},
	buildSiteRoute(props, state) {
		return state.siteRoutes.map((route, index)=> {
			let {name,URL,UIGroup} = route.toObject();
			let _className = cx({
				"item": true
			});

			return UIGroup.includes("footer-quicklink") ? (
				<li key={name} className={_className}><a href={URL}>{name}</a></li>
			) : null
		});
	},
	buildFooter(props, state) {
		return (
			<div className="v-footer">
				<footer>
					<div className="footer-body">
						<div className="wrapper">
							<div className="logo">
								<div className="logo-img">
									<div className="f4logo-img-wrapper">
										<a href="/"><img alt="Logo" src={require("../../img/footer_f4_logo.png")}/></a>
									</div>
									<div className="fialogo-img-wrapper">
										<a href="http://www.fia.com" target="_blank" ><img
											src={require("../../img/footer_fia_logo.png")} alt="Logo"/></a>
									</div>
								</div>
								<div className="logo-text">
									<p>{initData.text.footerText1}</p>
								</div>
							</div>
						</div>
						<div className="wrapper">
							<div className="quick-navigation">
								<div className="content">
									<div>
										<h4 className="title">Quick navigation</h4>
									</div>
									<div>
										<ul>
											{this.buildSiteRoute(this.props, this.state)}
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div className="wrapper">
							<div className="contact-us">
								<div className="content">
									<div>
										<h4 className="title">Contact us</h4>
									</div>
									<div>
										<ul>
											<li>{initData.text.footerPhone1}</li>
											<li>{initData.text.footerPhone2}</li>
											<li><a href={"mailto:"+initData.text.footerEmail}>{`Mail: ${initData.text.footerEmail || "-"}`}</a></li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="footer-end">
						<div className="footer-end-text">
							{
								props.device === "phone" ?
									<p><a href="/terms">Terms & Conditions - Privacy<br/>© 2016 FIA - Formula 4</a></p>
									:
									<p><a href="/terms">Terms & Conditions - Privacy - © 2016 FIA - Formula 4</a></p>
							}

						</div>
					</div>
				</footer>
				<div className="footer-end-logo"><a href="http://www.fia.com" target="_blank"><img
					src={require("../../img/footer_fia_logo_grey.png")} alt="Logo"/></a></div>
			</div>
		)
	},
	render() {
		return this.buildFooter(this.props, this.state);
	}
});

module.exports = Footer;
