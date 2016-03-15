//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var Store = require("client/js/store");
//============================================
var Button = require("client/js/components/button");
var Loading = require("client/js/components/loading");
var NoResult = require("client/js/views/no-result");
var Share = require("client/js/views/share");

const Article = React.createClass({
	displayName: "Article",
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		title: React.PropTypes.string,
		author: React.PropTypes.string,
		timeline: React.PropTypes.string,
		video: React.PropTypes.string,
		image: React.PropTypes.string,
		summary: React.PropTypes.string,
		content: React.PropTypes.string,
		shareable: React.PropTypes.bool
	},
	getDefaultProps() {
		return {
			shareable: true
		}
	},
	buildInfo(props, state) {
		return mdx(props.device, {
			"phone": ()=> {
				return (
					<div className="info">
						{`Author : ${props.author}`}
						<br/>
						{props.timeline}
						{props.shareable && <Share title={props.title} photoShare={props.photoShare} image={props.image} content={props.summary} author={props.author} timeline={props.timeline}></Share>}
					</div>
				)
			}
		}, ()=> {
			return (
				<div className="info">
					{`Author : ${props.author} - ${props.timeline}`}
					{props.shareable && <Share title={props.title} photoShare={props.photoShare} image={props.image} content={props.summary} author={props.author} timeline={props.timeline}></Share>}
				</div>
			)
		})
	},
	buildComponent(props, state) {
		return (
			<div className="v-article">
				<div className="v-block-title">
					<h2 className="title">
						{props.title}
					</h2>
				</div>
				{props.author && this.buildInfo(props, state)}
				{
					props.video && props.video !== '</iframe>' && <div className="video-wrapper" dangerouslySetInnerHTML={{__html: props.video}}>
					</div>
				}
				{
					props.image && <div className="image-wrapper">
						<img src={props.image} alt={props.image}/>
					</div>
				}
				{
					props.summary && <div className="summary">
						{props.summary}
					</div>
				}
				<div className="content" dangerouslySetInnerHTML={{__html: props.content}}>
				</div>
			</div>
		);
	},
	render() {
		return this.buildComponent(this.props, this.state);
	}
});

module.exports = Article;
