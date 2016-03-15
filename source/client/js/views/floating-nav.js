module.exports = React.createClass({
	displayName: "FloatingNav",
	propTypes: {
		list: React.PropTypes.object
	},
	getInitialState() {
		return {
			sticky: null
		}
	},
	handleScrolling(e) {
		var detailPos = $('.p-drivers-detail').offset().top;
		//console.log($(window).scrollTop(), detailPos);
		if ($(window).scrollTop() >= detailPos) {
			this.setState({
				sticky: true
			})
		} else {
			this.setState({
				sticky: false
			})
		}
	},
	componentDidMount() {
		$(window).on("scroll", this.handleScrolling);
	},
	componentWillUnmount() {
		$(window).off("scroll", this.handleScrolling);
	},
	ref(dom) {
		this._dom = dom;
		this._top = this._dom.getBoundingClientRect().top;
	},
	buildComponent(props, state) {
		let _className = cx({
			"v-floating-nav": true,
			sticky: state.sticky
		});
		return (
			<div className={_className} ref={this.ref}>
				<ul className="wrapper">
					{
						props.list.map((value, index)=> {
							return <li key={value.get("URL")}><a href={value.get("URL")}>{value.get("title")}</a></li>
						})
					}
				</ul>
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state)
	}
});
