//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//===============================================
var Article = require("client/js/views/article");

var Page = React.createClass({
	displayName: "Article",
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
			article: Store.getters.article
		}
	},
	componentWillMount() {
		if (this.props.route.id) {
			Store.actions.getStaticPage({id: this.props.route.id});
		} else {
			Store.actions.getArticle({id: this.props.params.id});
		}

	},
	buildPage(props, state) {

		var className = cx({
			"p-article": true
		});

		return (
			<div className={className}>
				<Article shareable={!this.props.route.id} device={props.device} {...state.article.toObject()} />
			</div>
		)
	},
	render() {
		return this.buildPage(this.props, this.state)
	}
});

module.exports = Page;
