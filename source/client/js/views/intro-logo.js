
var IntroLogo = React.createClass({
	displayName: "IntroLogo",
	buildIntroLogo(props, state) {
		return (
				<ReactCSSTransitionGroup component="div" className="v-intro-logo" transitionName="trigger-ani"
																 transitionAppear={true} transitionAppearTimeout={1000}
																 transitionEnterTimeout={500} transitionLeaveTimeout={500}>
					{<div className="content">
						<h1 className="logo">
							<a href="/" title="COACH"> <img src="/img/coach_logo.png" alt="COACH" title="COACH" /></a>
						</h1>
					</div>}
				</ReactCSSTransitionGroup>
		)
	},
	render() {
		return this.buildIntroLogo(this.props, this.state);
	}
});

module.exports = IntroLogo;
