//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//===============================================
var News = require("client/js/views/news");

var Page = React.createClass({
	displayName: "NewsPage",
	propTypes: {
		device: React.PropTypes.string,
		children: React.PropTypes.node,
		route: React.PropTypes.object,
		history: React.PropTypes.object
	},
	mixins: [Reactor.ReactMixin],
	getDataBindings() {
		//The order matter - the list need to be uptop , before the meta state
		return {
			news: Store.getters.news
		}
	},
	componentWillMount() {
		Store.actions.getNewsList({type: "", role: "list"});
	},
	buildPage(props, state) {

		var className = cx({
			"p-news": true
		});

		return (
			<div className={className}>
				<div className="v-block-title">
					<h2 className="title">
						Latest News
					</h2>
					<p className="description">
						{initData.text.newsSubtitle1}
					</p>
				</div>
				<News device={props.device} showViewAll={false} {...state.news.toObject()} />
				{this.props.children && React.cloneElement(this.props.children, {
					device: this.state.device
				})}
			</div>
		)
	},
	render() {
		return this.buildPage(this.props, this.state)
	}
});

module.exports = Page;
