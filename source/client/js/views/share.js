//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//============================================
var Button = require("client/js/components/button");
var Head = require("react-helmet");
var scriptLoaded = false;

const Share = React.createClass({
	displayName: "Article",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		title: React.PropTypes.string,
		author: React.PropTypes.string,
		timeline: React.PropTypes.string,
		content: React.PropTypes.string,
		image: React.PropTypes.string,
		photoShare: React.PropTypes.string
	},
	getDefaultProps() {
		//Default value
		return {
			title: "",
			author: "",
			timeline: "",
			content: "",
			image: "",
			photoShare: ""
		}
	},
	componentDidMount() {
		if (!scriptLoaded) {
			let shareLib = (process.env.NODE_ENV === 'development') ? '//w.sharethis.com/button/buttons.js' : '/sites/all/themes/clubf4/js/buttons.js';
			window.switchTo5x = true;
			scriptLoaded = true;
			$.cachedScript(shareLib).done(()=> {
				stLight.options({
					publisher: "63430089-98ae-4d3a-b138-060be4e3cbd8",
					doNotHash: false,
					doNotCopy: false,
					hashAddressBar: false
				});
			});
		}
	},
	buildComponent(props, state) {
		let content = props.content;
		let summary, _meta;
		let photo = props.photoShare ? props.photoShare : '';

		content = content ? ` | ${content}` : '';
		summary = `${props.author} | ${props.timeline}${content}`;
		_meta = [
			{"property": "og:type", "content": 'article'},
			{"property": "og:url", "content": location.href},
			{"property": "og:title", "content": props.title},
			{"property": "og:description", "content": summary},
			{"property": "og:image", "content": photo}
		];

		return (
			<div className="v-share">
				{process.env.NODE_ENV === 'development' && <Head meta={_meta}/>}
				<span className='share st_sharethis_large'></span>
			</div>
		);
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

module.exports = Share;
